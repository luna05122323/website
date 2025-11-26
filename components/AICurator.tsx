import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { Artwork, ChatMessage } from '../types';
import { chatWithCurator } from '../services/geminiService';

interface AICuratorProps {
  artwork: Artwork;
}

const AICurator: React.FC<AICuratorProps> = ({ artwork }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Greetings. I am the digital curator. Feel free to ask me anything about "${artwork.title}".` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await chatWithCurator(messages, input, artwork);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-stone-200 dark:border-stone-800">
      {/* Chat Header */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center space-x-2 text-stone-800 dark:text-museum-gold">
        <Sparkles size={16} />
        <span className="text-sm font-serif tracking-wide uppercase">Ask the Curator</span>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px] custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
              <div className={`p-2 rounded-full ${
                msg.role === 'user' 
                  ? 'bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200' 
                  : 'bg-museum-gold text-museum-900'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-3 rounded-lg text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200' 
                  : 'bg-white dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-center gap-2 text-xs text-stone-400 ml-10">
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800 flex gap-2 bg-white dark:bg-transparent rounded-b-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about technique, history..."
          className="flex-1 bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-3 py-2 text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:border-museum-gold placeholder-stone-400 dark:placeholder-stone-600"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-museum-gold text-museum-900 p-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AICurator;