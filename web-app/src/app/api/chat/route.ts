import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getChatModel } from '@/lib/ai/gemini';

// Avoid re-initializing Firebase Admin if it's already spun up
if (!admin.apps.length) {
  admin.initializeApp({
    credential: process.env.FIREBASE_PRIVATE_KEY
      ? admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle Next.js escaping newlines in .env.local string
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
      : admin.credential.applicationDefault(), // Relies on GOOGLE_APPLICATION_CREDENTIALS
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}
const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required and must be an array.' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    // Since we fallback to process.env.GOOGLE_API_KEY in the gemini.ts file just in case, we check if genAI is properly initialized
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    // Check user credits
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    
    let currentCredits = 1000; // Default for Starter
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      currentCredits = userData?.credits !== undefined ? userData.credits : 1000;
    } else {
      // Give initial starter credits if no profile exists yet
      await userDocRef.set({
        subscriptionStatus: "active",
        subscription: "starter",
        credits: 1000,
      }, { merge: true });
    }

    if (currentCredits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits. Please upgrade your subscription.' }, { status: 403 });
    }

    const model = getChatModel();

    let chatHistory = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Start chat with history excluding the very last message (the new prompt)
    let history = chatHistory.slice(0, -1);
    
    // Gemini validation: The first item in history must have role 'user'. 
    // And histories must alternate between 'user' and 'model' (though the first is the strict error).
    if (history.length > 0 && history[0].role !== 'user') {
      history.shift(); // Remove initial model role message
    }

    const latestMessage = chatHistory[chatHistory.length - 1]?.parts[0]?.text || '';

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(latestMessage);
    const responseText = result.response.text();
    
    // Calculate tokens used (fallback to 1 if not available)
    const tokensUsed = result.response.usageMetadata?.totalTokenCount || 10;
    
    // Deduct credits
    const newCredits = Math.max(0, currentCredits - tokensUsed);
    await userDocRef.set({ credits: newCredits }, { merge: true });

    return NextResponse.json({ 
      response: responseText, 
      tokensUsed, 
      remainingCredits: newCredits 
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    // Graceful fallback for unavailable models 
    if (error.message && error.message.includes('models/gemini-3.1-pro is not found')) {
       try {
         // Graceful fallback for unavailable models 
         return NextResponse.json({ error: 'Model 3.1 Pro not available. Please verify API access or check region.', fallback: true }, { status: 500 });
       } catch (e) {}
    }
    return NextResponse.json({ error: error.message || 'Error processing your request.' }, { status: 500 });
  }
}
