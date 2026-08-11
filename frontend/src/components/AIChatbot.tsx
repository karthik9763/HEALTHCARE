import React, { useState, useEffect } from 'react';
import { Bot, Mic, MicOff, Send, Volume2, Sparkles, X, Heart, ShieldAlert } from 'lucide-react';

interface AIChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen = true, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Hello, I am PulseCare AI First-Aid Assistant. How can I assist you or guide you through first-aid procedures while emergency services arrive?',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // First-Aid Knowledge Base Fallback Logic
  const getAIAnswer = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('cpr') || q.includes('chest') || q.includes('stop breathing')) {
      return "CPR Instructions: 1) Place your hands in the center of the chest. 2) Push hard and fast at 100-120 compressions per minute (to the beat of 'Stayin Alive'). 3) Keep arms straight. Do not stop until paramedics arrive.";
    }
    if (q.includes('heart') || q.includes('bp') || q.includes('pressure')) {
      return "For High Heart Rate or BP: Sit down immediately, practice slow deep breathing (in internal 4s, out 4s), remain calm, and avoid caffeine or sudden movements. We are tracking your vitals live.";
    }
    if (q.includes('bleed') || q.includes('cut') || q.includes('blood')) {
      return "For Severe Bleeding: Apply firm, continuous direct pressure with a clean cloth or bandage. Elevate the wounded area above heart level if possible. Do not remove soaked cloths; add more layers on top.";
    }
    if (q.includes('burn') || q.includes('fire')) {
      return "For Burns: Cool the burn under cool running water for at least 10 minutes. Cover loosely with a sterile, non-stick dressing. Do NOT apply ice, butter, or ointment to open burns.";
    }
    if (q.includes('stroke') || q.includes('face') || q.includes('slur')) {
      return "FAST Stroke Test: F-Face drooping, A-Arm weakness, S-Speech difficulty, T-Time to call emergency! An ambulance has been alerted with highest priority.";
    }
    return "Stay calm and keep your phone nearby. Our dispatch system has notified nearest responders. Keep the patient still, unlock your front door or gate, and ensure clear entry for the paramedics.";
  };

  const handleSend = (textToSend?: string) => {
    const msg = textToSend || input;
    if (!msg.trim()) return;

    const userMsg = { sender: 'user' as const, text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      const aiReply = getAIAnswer(msg);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      speakText(aiReply);
    }, 600);
  };

  // Text to Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech Recognition (Web Speech API)
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert('Speech Recognition is not supported by your current browser.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] max-w-lg w-full mx-auto">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 p-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              PulseCare AI Voice & First-Aid Assistant
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            </h3>
            <p className="text-[11px] text-red-100">Instant CPR, Triage & Medical First-Aid Guidance</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/60">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-800/90 text-slate-100 border border-slate-700 rounded-bl-none'
            }`}>
              <div className="flex items-center justify-between gap-2 mb-1 border-b border-white/10 pb-1">
                <span className="font-bold text-[10px] uppercase opacity-80">
                  {m.sender === 'user' ? 'You' : 'PulseCare AI'}
                </span>
                <span className="text-[9px] opacity-60">{m.time}</span>
              </div>
              <p>{m.text}</p>
              {m.sender === 'ai' && (
                <button
                  onClick={() => speakText(m.text)}
                  className="mt-2 text-[10px] text-amber-400 flex items-center gap-1 hover:underline"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Listen to audio guidance</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Chips */}
      <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleSend('How to perform CPR?')}
          className="bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full shrink-0"
        >
          ❤️ CPR Guide
        </button>
        <button
          onClick={() => handleSend('What to do for severe bleeding?')}
          className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full shrink-0"
        >
          🩸 Bleeding
        </button>
        <button
          onClick={() => handleSend('How to lower high heart rate?')}
          className="bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full shrink-0"
        >
          💓 High HR / BP
        </button>
        <button
          onClick={() => handleSend('Stroke symptoms FAST check')}
          className="bg-slate-800 hover:bg-slate-700 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full shrink-0"
        >
          🧠 Stroke FAST
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <button
          onClick={toggleVoiceInput}
          className={`p-2.5 rounded-xl border transition-all ${
            isListening
              ? 'bg-red-600 text-white border-red-500 animate-pulse'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title="Voice Emergency Command"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-red-400" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI first-aid or describe symptoms..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
        />

        <button
          onClick={() => handleSend()}
          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white p-2.5 rounded-xl shadow-md transition-transform active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
