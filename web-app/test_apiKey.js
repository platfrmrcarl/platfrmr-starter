try {
  require('stripe')("");
} catch(e) {
  console.log("Stripe error:", e.message);
}
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  new GoogleGenerativeAI("");
} catch (e) {
  console.log("Gemini error:", e.message);
}
