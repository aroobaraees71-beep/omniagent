
import React, { useState, useRef, useEffect } from 'react';
import { Message, ChannelType, UserRole, BusinessConfig } from '../types';
import { generateAgentResponse } from '../services/geminiService';

interface ChatWindowProps {
  channel: ChannelType;
  userRole: UserRole;
  config: BusinessConfig;
  onConfigUpdate: (updates: Partial<BusinessConfig>) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ channel, userRole, config, onConfigUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial welcome message based on role
  useEffect(() => {
    const welcome = userRole === UserRole.BUSINESS_OWNER 
      ? "Welcome to OmniAgent! I'm your dedicated messaging assistant. Since we're just getting started, could you tell me your business name and what you offer?"
      : `Hi! Thanks for reaching out to ${config.name || 'our business'}. How can I assist you today?`;
    
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: welcome,
      timestamp: Date.now()
    }]);
  }, [userRole, config.name]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Context detection for onboarding (Heuristic-based for the UI state)
    if (userRole === UserRole.BUSINESS_OWNER && !config.name) {
      // Very simple local detection to update the dashboard config visually
      if (input.toLowerCase().includes('name is') || input.length < 30) {
        onConfigUpdate({ name: input.replace(/my name is|business name is/gi, '').trim() });
      }
    }

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const response = await generateAgentResponse(input, history, config, channel, userRole);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const getChannelStyles = () => {
    switch (channel) {
      case ChannelType.WHATSAPP: return "bg-[#e5ddd5]";
      case ChannelType.TELEGRAM: return "bg-[#64a1e0]";
      case ChannelType.SMS: return "bg-white";
      default: return "bg-slate-50";
    }
  };

  const getBubbleStyles = (role: 'user' | 'assistant') => {
    const isAssistant = role === 'assistant';
    if (channel === ChannelType.WHATSAPP) {
      return isAssistant 
        ? "bg-white text-slate-800 rounded-lg shadow-sm" 
        : "bg-[#dcf8c6] text-slate-800 rounded-lg shadow-sm ml-auto";
    }
    if (channel === ChannelType.TELEGRAM) {
      return isAssistant 
        ? "bg-white text-slate-800 rounded-2xl shadow-sm" 
        : "bg-[#effdde] text-slate-800 rounded-2xl shadow-sm ml-auto";
    }
    return isAssistant 
      ? "bg-indigo-600 text-white rounded-2xl rounded-bl-none" 
      : "bg-slate-200 text-slate-800 rounded-2xl rounded-br-none ml-auto";
  };

  return (
    <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            {channel === ChannelType.WHATSAPP && <span className="text-xl">💬</span>}
            {channel === ChannelType.TELEGRAM && <span className="text-xl">✈️</span>}
            {channel === ChannelType.WEBSITE && <span className="text-xl">🌐</span>}
            {channel === ChannelType.SMS && <span className="text-xl">📱</span>}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 capitalize">{channel} Preview</h3>
            <p className="text-xs text-slate-400 font-medium">Acting as {userRole.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 rounded-full bg-green-100 text-[10px] font-bold text-green-700 uppercase">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${getChannelStyles()}`} ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 text-sm transition-all duration-200 ${getBubbleStyles(msg.role)}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-3 rounded-2xl flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message as ${userRole === UserRole.BUSINESS_OWNER ? 'Owner' : 'Customer'}...`}
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
