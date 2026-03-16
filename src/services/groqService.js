const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const getSystemPrompt = (language) => {
  return `You are an AI stylist at LuxeSense, a luxury fashion app. You help people find beautiful items from brands like Hermès, Chanel, Louis Vuitton, Cartier, Rolex.

CRITICAL LANGUAGE RULE: Always respond in the SAME language the user writes in. If they write in English, respond in English. If they write in Turkish, respond in Turkish. Match their language exactly.

How to respond:
- Be friendly and natural, not robotic
- Keep responses short (2-3 sentences)
- You can use emojis occasionally
- If someone says hi, just say hi back casually
- Give helpful fashion advice when asked
- Be enthusiastic but not over the top`;
};

export const getAIResponse = async (userMessage, conversationHistory = [], language = 'en') => {
  try {
    const messages = [
      { role: 'system', content: getSystemPrompt(language) },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm here to help you find the perfect luxury piece. What are you looking for today?";
  } catch (error) {
    console.error('Groq API Error:', error);
    return "I'm having a moment, darling. Could you try again? ✨";
  }
};

export const getSAResponse = async (userMessage, customerName, conversationHistory = [], language = 'en') => {
  const SA_SYSTEM_PROMPT = `You are Isabelle, a friendly sales advisor at LuxeSense luxury boutique. You're chatting with ${customerName}, a valued client.

CRITICAL LANGUAGE RULE: Always respond in the SAME language the user writes in. If they write in English, respond in English. If they write in Turkish, respond in Turkish. Match their language exactly.

How to respond:
- Be natural and conversational, like texting a friend
- Keep it short (1-2 sentences max)
- Be helpful but not overly formal
- You can use casual expressions
- Don't be robotic or corporate-sounding
- If they say hi, just say hi back naturally
- Match their energy - if they're casual, be casual

You can help with: product questions, appointments, orders, recommendations.`;

  try {
    const messages = [
      { role: 'system', content: SA_SYSTEM_PROMPT },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "How may I assist you today?";
  } catch (error) {
    console.error('Groq API Error:', error);
    return "Apologies, let me check on that for you. One moment please.";
  }
};
