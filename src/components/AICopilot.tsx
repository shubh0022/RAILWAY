'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Send, X, Mic, RefreshCw, Volume2, Sparkles } from 'lucide-react';
import { useAppStore } from '../store';

export const AICopilot: React.FC = () => {
  const router = useRouter();
  const { chatMessages, addChatMessage, isCopilotOpen, setCopilotOpen, walletBalance } = useAppStore();
  const [inputVal, setInputVal] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState<string | null>(null);
  
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, isCopilotOpen]);

  if (!isCopilotOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setCopilotOpen(true)}
          className="bg-[linear-gradient(135deg,#fb7613_0%,#d25900_100%)] hover:brightness-110 shadow-2xl p-4 rounded-full text-white cursor-pointer active:scale-95 transition-all flex items-center gap-2 group border border-white/10"
          aria-label="Open AI Travel Copilot Assistant"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-extrabold text-xs uppercase tracking-wider whitespace-nowrap pr-0 group-hover:pr-1">
            AI Travel Copilot
          </span>
        </button>
      </div>
    );
  }

  // Speak response out loud (simulated text-to-speech visualizer)
  const handleSpeak = (text: string, msgId: string) => {
    if (isSpeaking === msgId) {
      setIsSpeaking(null);
    } else {
      setIsSpeaking(msgId);
      setTimeout(() => {
        setIsSpeaking(null);
      }, 4000);
    }
  };

  // Mock voice input trigger
  const handleVoiceTrigger = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputVal('Will my Rajdhani Express be delayed today?');
    }, 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    addChatMessage({
      id: `copilot-user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });

    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000));

    let reply = '';
    const text = userText.toLowerCase();

    if (text.includes('delay') || text.includes('late') || text.includes('schedule')) {
      reply = `⏱️ **AI Delay Prediction Engine**:\n\nAnalyzing grid congestion and signaling logs for **Rajdhani Express (12423)**...\n\n**Prediction:** There is a **5% probability of delay** (sub-10 min delay). Currently running on schedule. Status: **ON TIME**.`;
    } else if (text.includes('waitlist') || text.includes('chance') || text.includes('probability')) {
      reply = `📈 **AI Waitlist Forecast (Sleeper & 3A)**:\n\n**Route:** NDLS ➔ HWH\n**Waitlist Position:** WL-22\n\n**Confirmation Chance:** **85% (High Probability)**\n\n*Analysis:* Historical cancel cycles peak on weekdays. We recommend booking.`;
    } else if (text.includes('refund') || text.includes('cancel')) {
      reply = `💸 **Smart Refund Calculator**:\n\nIf you cancel a **Confirmed AC Ticket** 48 hours prior to departure:\n- Cancellation Fee: **₹250 flat**\n- Refund Method: **Instant to National Mobility Wallet**\n- Processing time: **Immediate (<1 minute)**.`;
    } else if (text.includes('plan') || text.includes('trip') || text.includes('itinerary')) {
      reply = `🗺️ **AI Multi-Modal Itinerary (Goa Weekend Tour)**:\n\n- **Friday 16:55:** Board Rajdhani Express from NDLS.\n- **Saturday 10:45:** Arrival at Madgaon (MAO). Local Ola Cab booked to Hotel.\n- **Stay:** Deluxe room at Cidade de Goa.\n- **Sunday 20:30:** Return flight booked from Goa (GOI) to Delhi (DEL).\n\nTotal package cost: **₹18,500.00**. Top up wallet to checkout!`;
    } else if (text.includes('book') || text.includes('search')) {
      reply = `🎫 **Conversational Booking Agent**:\n\nI can pre-fill search configurations for you. \n\n*Destination preloaded:* New Delhi (NDLS) to Mumbai Central (MMCT).\n*Date:* Tomorrow. \n\n[Click here to swap search parameters](file:///) or click "Search" on the homepage widget.`;
    } else if (text.includes('wallet') || text.includes('balance')) {
      reply = `💳 **National Mobility Wallet Profile**:\n\n- Available Balance: **₹${walletBalance.toFixed(2)}**\n- Status: Verified & UPI Linked\n- Deposit status: KYC complete\n\nYou can use the wallet balance for rapid Tatkal booking without entering card details!`;
    } else {
      reply = 'I am your AI Travel Copilot. I support:\n\n- **Conversational Booking** (e.g. "book train to Goa")\n- **Delay Forecasts** (e.g. "will train 12423 be delayed?")\n- **Waitlist Forecasts** (e.g. "waitlist chance for WL-22")\n- **Refund Estimates** (e.g. "what is the cancellation fee?")\n- **Wallet Checks** (e.g. "check wallet balance")';
    }

    addChatMessage({
      id: `copilot-disha-${Date.now()}`,
      sender: 'disha',
      text: reply,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });

    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[390px] h-[480px] bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="bg-brand-blue py-4 px-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-brand-orange/15 p-2 rounded-xl text-brand-orange border border-brand-orange/25 relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent-green" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white flex items-center gap-1.5 leading-none">
              AI Travel Copilot
              <span className="bg-brand-orange/10 text-brand-orange text-[9px] font-black px-1.5 py-0.5 rounded">2047 OS</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold block mt-1">Ask anything about your journey</span>
          </div>
        </div>
        <button
          onClick={() => setCopilotOpen(false)}
          className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer hover:bg-white/5 transition-colors"
          aria-label="Close Chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* MESSAGE STREAM AREA */}
      <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4 text-xs">
        {chatMessages.map((msg) => {
          const isDisha = msg.sender === 'disha';
          const speaking = isSpeaking === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${isDisha ? 'self-start items-start' : 'self-end items-end animate-slide-up'}`}
            >
              <div
                className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed font-medium relative group
                  ${isDisha 
                    ? 'bg-brand-blue/60 text-slate-200 rounded-tl-none border border-white/5' 
                    : 'bg-brand-orange text-white rounded-tr-none shadow-md shadow-brand-orange/5'}`}
              >
                {msg.text}

                {/* TTS Reader Button for accessibility (Module 10/13) */}
                {isDisha && (
                  <button
                    onClick={() => handleSpeak(msg.text, msg.id)}
                    className={`absolute bottom-1 -right-7 p-1 rounded bg-white/5 border border-white/5 text-slate-500 hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity
                      ${speaking && 'opacity-100 text-brand-orange-light'}`}
                    title="Speak response out loud"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${speaking && 'animate-pulse'}`} />
                  </button>
                )}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 select-none">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="self-start bg-brand-blue/60 border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* QUICK SUGGESTIONS CHEATSHEET */}
      <div className="px-3 py-2 border-t border-white/5 bg-slate-950/40 flex gap-2 overflow-x-auto select-none">
        <button 
          onClick={() => setInputVal('will train 12423 be delayed?')} 
          className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[9px] font-extrabold text-slate-400 hover:text-white shrink-0 cursor-pointer transition-colors"
        >
          ⏱️ Delay prediction
        </button>
        <button 
          onClick={() => setInputVal('what is the confirmation probability for WL-22?')} 
          className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[9px] font-extrabold text-slate-400 hover:text-white shrink-0 cursor-pointer transition-colors"
        >
          📈 Waitlist Forecast
        </button>
        <button 
          onClick={() => setInputVal('tell me a multi-modal trip plan for Goa')} 
          className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[9px] font-extrabold text-slate-400 hover:text-white shrink-0 cursor-pointer transition-colors"
        >
          🗺️ Trip Planning
        </button>
      </div>

      {/* INPUT FORM WITH MOCK VOICE LISTENING TRIGGER */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/5 flex gap-2 items-center bg-slate-950/20">
        
        {/* Mock voice mic button */}
        <button
          type="button"
          onClick={handleVoiceTrigger}
          className={`p-2 rounded-xl border text-white cursor-pointer active:scale-95 transition-all
            ${isListening 
              ? 'bg-rose-500 border-rose-500 animate-pulse' 
              : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          title={isListening ? "Listening..." : "Trigger Voice Interaction"}
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder={isListening ? "Listening to voice input..." : "Ask your copilot..."}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={isListening}
          className="flex-grow bg-brand-blue/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-orange font-medium"
        />

        <button
          type="submit"
          className="bg-brand-orange p-2.5 rounded-xl text-white cursor-pointer hover:brightness-110 active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* VOICE LISTENING DIALOG OVERLAY */}
      {isListening && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-4 z-50 animate-fade-in">
          <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-full animate-pulse flex items-center justify-center relative">
            <Mic className="w-8 h-8 text-rose-500" />
            <span className="absolute inset-0 rounded-full border border-rose-500/30 scale-125 animate-ping" />
          </div>
          <div className="text-center">
            <span className="font-black text-sm uppercase block tracking-wider text-rose-500">VOICE CAPTURE ACTIVE</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Try speaking: "Is my train delayed?"</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICopilot;
