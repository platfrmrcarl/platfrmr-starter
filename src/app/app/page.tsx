"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase/config";
import { doc, onSnapshot, collection, query, where, orderBy, addDoc, serverTimestamp, updateDoc, getDoc } from "firebase/firestore";

type Message = {
  role: "user" | "model";
  content: string;
};

type ChatSession = {
  id: string;
  name: string;
};

function AppContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgradeParam = searchParams.get('upgrade');
  
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hello! I am your assistant (powered by 8-Agent Swarm and Gemini 3.1). Describe your tasks here and I will help you complete them." }
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [subscription, setSubscription] = useState<string | null>(null);
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.credits !== undefined) {
            setCredits(data.credits);
          } else {
            // Default active credits logic if missing in existing docs
            setCredits(1000); 
          }
          if (data.subscription) {
            setSubscription(data.subscription);
          } else {
            setSubscription("starter");
          }
        } else {
          // If no doc exists yet, default to starter plan credits visually until webhook fires
          setCredits(1000);
          setSubscription("starter");
        }
      }, (error) => {
        console.error("Error fetching user credits:", error);
      });

      const q = query(collection(db, "chats"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      const unsubChats = onSnapshot(q, (snapshot) => {
        const loadedChats = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || "Untitled Chat"
          };
        }) as ChatSession[];
        setRecentChats(loadedChats);
      }, (error) => {
        console.error("Error fetching recent chats:", error);
      });

      return () => {
        unsub();
        unsubChats();
      };
    }
  }, [user]);

  const handleLoadChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    setChatLoading(true);
    try {
      const chatDoc = await getDoc(doc(db, "chats", chatId));
      if (chatDoc.exists()) {
        const data = chatDoc.data();
        if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages([{ role: "model", content: "Hello! I am your assistant (powered by 8-Agent Swarm and Gemini 3.1). Describe your tasks here and I will help you complete them." }]);
        }
      }
    } catch (e) {
      console.error("Error loading chat:", e);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    if (credits !== null && credits <= 0) {
      setMessages([...messages, { role: "model", content: "You have run out of credits! Please upgrade your plan to continue." }]);
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setChatLoading(true);

    let activeChatId = currentChatId;

    if (!activeChatId && user) {
      try {
        const words = input.split(' ');
        const chatName = words.slice(0, 10).join(' ') + (words.length > 10 ? "..." : "");
        const newChat = await addDoc(collection(db, "chats"), {
          userId: user.uid,
          name: chatName,
          messages: newMessages,
          createdAt: new Date()
        });
        activeChatId = newChat.id;
        setCurrentChatId(activeChatId);
      } catch (e) {
        console.error("Could not save chat metadata:", e);
      }
    } else if (activeChatId && user) {
      try {
        await updateDoc(doc(db, "chats", activeChatId), {
          messages: newMessages
        });
      } catch (e) {
        console.error("Could not update chat messages:", e);
      }
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, userId: user?.uid }),
      });

      const data = await response.json();
      
      let finalMessages: Message[];
      if (data.error) {
        finalMessages = [...newMessages, { role: "model", content: `Error: ${data.error}` }];
      } else {
        finalMessages = [...newMessages, { role: "model", content: data.response }];
      }
      
      setMessages(finalMessages);
      
      if (activeChatId && user) {
        try {
          await updateDoc(doc(db, "chats", activeChatId), {
            messages: finalMessages
          });
        } catch (e) {
           console.error("Could not append model response to chat records:", e);
        }
      }
      
    } catch (err) {
      const fallbackMessages: Message[] = [...newMessages, { role: "model", content: "Sorry, I couldn't reach the server. Please try again." }];
      setMessages(fallbackMessages);
      if (activeChatId && user) {
         try {
           await updateDoc(doc(db, "chats", activeChatId), { messages: fallbackMessages });
         } catch (e) {}
      }
    } finally {
      setChatLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-full mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] mt-2 mx-2 rounded-xl border border-base-200 shadow-sm bg-base-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex flex-col w-64 lg:w-72 bg-base-200/40 border-r border-base-200 flex-shrink-0">
        <div className="p-4 flex flex-col gap-3">
          {credits !== null && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center shadow-inner">
               <span className="text-xs uppercase tracking-widest font-semibold text-primary/70 mb-2">
                 {subscription ? `${subscription} plan` : 'Current Plan'}
               </span>
               <span className="text-[10px] uppercase tracking-widest font-semibold text-base-content/50 mb-1">Tokens Left</span>
               <span className="text-xl font-bold text-primary">{credits.toLocaleString()}</span>
            </div>
          )}
          <button 
            className="btn btn-outline btn-primary rounded-full w-full justify-start gap-2"
            onClick={() => {
              setMessages([{ role: "model", content: "Hello! I am your Agent assistant (powered by Gemini 3.1 Pro). Describe your tasks here and I will help you complete them." }]);
              setCurrentChatId(null);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            New chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="text-xs font-semibold px-2 mb-2 text-base-content/50 uppercase tracking-wider">Recent</p>
          <ul className="space-y-1 mt-2">
            {recentChats.map((chat) => (
              <li key={chat.id}>
                <button 
                  onClick={() => handleLoadChat(chat.id)}
                  className={`btn btn-ghost btn-sm w-full justify-start font-normal text-left truncate opacity-80 hover:opacity-100 hover:bg-base-200 ${currentChatId === chat.id ? 'bg-base-200' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                  <span className="truncate">{chat.name}</span>
                </button>
              </li>
            ))}
            {recentChats.length === 0 && (
              <li className="px-3 text-sm opacity-50 italic">No recent chats yet</li>
            )}
          </ul>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-base-100 relative">
        {upgradeParam === 'success' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down w-11/12 max-w-2xl">
            <div className="alert alert-success shadow-xl">
              <span>🎉 Your Pro Upgrade was successful! You now have unlimited agent interactions.</span>
              <button 
                onClick={() => router.replace('/app')} 
                className="btn btn-sm btn-ghost btn-circle ml-auto"
              >✕</button>
            </div>
          </div>
        )}

        {/* Chat Header */}
        <div className="p-4 border-b border-base-200/50 bg-base-100/90 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center">
              
            </span> 
          </div>
          <div className="badge badge-primary badge-outline font-medium px-3 bg-primary/5">Gemini 3.1 Pro</div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8">
            {messages.map((msg, index) => (
              <div key={index} className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xl shadow-sm ${msg.role === 'model' ? 'bg-primary text-primary-content overflow-hidden ring-1 ring-primary/20' : 'bg-transparent overflow-hidden'}`}>
                    {msg.role === 'model' ? (
                      <Image src="/logo.png" alt="Agent" width={36} height={36} className="object-cover w-full h-full" />
                    ) : (
                      <Image src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}`} alt="User" width={36} height={36} className="object-cover w-full h-full rounded-full" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm opacity-80 mb-1.5 flex items-center gap-2">
                    {msg.role === 'model' ? 'Agent' : 'You'}
                  </div>
                  <div className={`prose prose-sm md:prose-base max-w-none leading-relaxed ${msg.role === 'user' ? 'text-base-content/90' : 'text-base-content'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            
            {chatLoading && (
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm bg-primary text-primary-content overflow-hidden ring-1 ring-primary/20">
                    <Image src="/logo.png" alt="Agent" width={36} height={36} className="object-cover w-full h-full" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm opacity-80 mb-1.5">Agent</div>
                  <div className="h-6 flex items-center mt-1">
                    <span className="loading loading-dots loading-md text-primary"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gradient-to-t from-base-100 via-base-100 to-transparent w-full pt-8 pb-6">
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSendMessage} className="relative flex items-center shadow-2xl rounded-3xl bg-base-100 border border-base-200">
              <input
                type="text"
                placeholder="Instruct the agent..."
                className="input input-lg w-full pl-6 pr-16 bg-transparent border-0 focus:outline-none focus:ring-0 rounded-3xl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={chatLoading}
              />
              <button 
                type="submit" 
                className="btn btn-circle btn-primary btn-sm absolute right-3 shadow-md hover:scale-105 transition-transform"
                disabled={chatLoading || !input.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
            <p className="text-center text-[11px] opacity-40 mt-3 font-medium">
              Agent can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>}>
      <AppContent />
    </Suspense>
  );
}
