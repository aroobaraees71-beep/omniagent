
import React from 'react';
import { ChannelType, UserRole } from '../types';

interface SidebarProps {
  currentChannel: ChannelType;
  setChannel: (c: ChannelType) => void;
  userRole: UserRole;
  setUserRole: (r: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentChannel, setChannel, userRole, setUserRole }) => {
  return (
    <div className="w-72 border-r border-slate-200 h-screen p-6 bg-white hidden md:flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-indigo-600 mb-1">OmniAgent</h1>
        <p className="text-xs text-slate-500 font-medium">SaaS DASHBOARD</p>
      </div>

      <nav className="flex flex-col gap-6">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Persona</p>
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setUserRole(UserRole.BUSINESS_OWNER)}
              className={`px-3 py-2 text-sm rounded-lg text-left transition-colors ${userRole === UserRole.BUSINESS_OWNER ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Business Owner
            </button>
            <button 
              onClick={() => setUserRole(UserRole.CUSTOMER)}
              className={`px-3 py-2 text-sm rounded-lg text-left transition-colors ${userRole === UserRole.CUSTOMER ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              End Customer
            </button>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Channels</p>
          <div className="flex flex-col gap-1">
            {Object.values(ChannelType).map((channel) => (
              <button
                key={channel}
                onClick={() => setChannel(channel)}
                className={`px-3 py-2 text-sm rounded-lg text-left capitalize transition-colors ${currentChannel === channel ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-[10px] text-slate-400 mb-1 uppercase font-bold">Integration Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium text-slate-700">All Systems Online</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
