
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { ChannelType, UserRole, BusinessConfig } from './types';

const App: React.FC = () => {
  const [currentChannel, setCurrentChannel] = useState<ChannelType>(ChannelType.WEBSITE);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.BUSINESS_OWNER);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>({
    name: '',
    offering: '',
    audience: '',
    primaryGoal: 'Support',
    channels: [ChannelType.WEBSITE]
  });

  const updateConfig = (updates: Partial<BusinessConfig>) => {
    setBusinessConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleChannel = (channel: ChannelType) => {
    const currentChannels = businessConfig.channels || [];
    const newChannels = currentChannels.includes(channel)
      ? currentChannels.filter(c => c !== channel)
      : [...currentChannels, channel];
    updateConfig({ channels: newChannels });
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar 
        currentChannel={currentChannel} 
        setChannel={setCurrentChannel}
        userRole={currentUserRole}
        setUserRole={setCurrentUserRole}
      />
      
      <main className="flex-1 flex flex-col md:flex-row h-full">
        <ChatWindow 
          channel={currentChannel}
          userRole={currentUserRole}
          config={businessConfig}
          onConfigUpdate={updateConfig}
        />

        {/* Info Panel / Configuration Form */}
        <div className="w-80 border-l border-slate-200 bg-white p-6 hidden lg:flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-4">Agent Configuration</h2>
            <div className="space-y-4">
              <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Business Name</label>
                <input 
                  type="text"
                  value={businessConfig.name}
                  onChange={(e) => updateConfig({ name: e.target.value })}
                  placeholder="e.g. Bloom Florals"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Business Offering</label>
                <textarea 
                  value={businessConfig.offering}
                  onChange={(e) => updateConfig({ offering: e.target.value })}
                  placeholder="Describe your products or services in detail..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Target Audience</label>
                <input 
                  type="text"
                  value={businessConfig.audience}
                  onChange={(e) => updateConfig({ audience: e.target.value })}
                  placeholder="e.g. Local homeowners"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Primary Goal</label>
                <select 
                  value={businessConfig.primaryGoal}
                  onChange={(e) => updateConfig({ primaryGoal: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="Support">Customer Support</option>
                  <option value="Sales">Drive Sales</option>
                  <option value="Bookings">Set Appointments</option>
                  <option value="Leads">Generate Leads</option>
                </select>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Preferred Channels</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(ChannelType).map((channel) => (
                    <label key={channel} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-all">
                      <input 
                        type="checkbox"
                        checked={businessConfig.channels?.includes(channel)}
                        onChange={() => toggleChannel(channel)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span className="text-xs font-medium text-slate-600 capitalize">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Channel Insights</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100/50">
                <p className="text-[10px] text-indigo-400 font-bold uppercase">Messages</p>
                <p className="text-xl font-bold text-indigo-700">1.2k</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl border border-green-100/50">
                <p className="text-[10px] text-green-400 font-bold uppercase">Uptime</p>
                <p className="text-xl font-bold text-green-700">99.9%</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-100">
              <h3 className="text-xs font-bold mb-2">PRO TIP</h3>
              <p className="text-xs opacity-90 leading-relaxed">
                Enable multiple channels to reach customers where they are most comfortable.
              </p>
              <button className="mt-3 text-[10px] bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider">
                Read Setup Guide
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Role Switcher */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 flex gap-2 z-50 pointer-events-none">
         <div className="flex w-full bg-white/90 backdrop-blur border border-slate-200 rounded-full p-1 shadow-2xl pointer-events-auto">
            <button 
              onClick={() => setCurrentUserRole(UserRole.BUSINESS_OWNER)}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${currentUserRole === UserRole.BUSINESS_OWNER ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
            >
              Owner Mode
            </button>
            <button 
              onClick={() => setCurrentUserRole(UserRole.CUSTOMER)}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${currentUserRole === UserRole.CUSTOMER ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
            >
              Customer Mode
            </button>
         </div>
      </div>
    </div>
  );
};

export default App;
