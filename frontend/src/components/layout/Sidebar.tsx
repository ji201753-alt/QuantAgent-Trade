import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Search,
  ShieldAlert,
  Globe,
  Settings,
  Maximize2,
  ChevronRight
} from 'lucide-react';
import { theme } from '../../theme';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  id, label, icon: Icon, isActive, onClick, isCollapsed
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all relative group overflow-hidden ${
      isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
    }`}
  >
    {isActive && (
      <motion.div
        layoutId="sidebar-active"
        className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"
      />
    )}
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
    {!isCollapsed && (
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    )}

    {/* Tooltip for collapsed state */}
    {isCollapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-black uppercase tracking-widest text-slate-100 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-2xl">
        {label}
      </div>
    )}
  </button>
);

export const IntelligentSidebar: React.FC<{
  activeWorkspace: string;
  setActiveWorkspace: (id: string) => void;
}> = ({ activeWorkspace, setActiveWorkspace }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 48 : 200 }}
      className="h-full bg-black border-r border-slate-900 flex flex-col z-50 shadow-[20px_0_40px_rgba(0,0,0,0.8)]"
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="flex-1 py-4 flex flex-col gap-1">
        <SidebarItem
          id="realtime"
          label="Realtime_Monitor"
          icon={Activity}
          isActive={activeWorkspace === 'realtime'}
          onClick={() => setActiveWorkspace('realtime')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          id="research"
          label="Factor_Research"
          icon={Search}
          isActive={activeWorkspace === 'research'}
          onClick={() => setActiveWorkspace('research')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          id="operational"
          label="Operational_Inv"
          icon={ShieldAlert}
          isActive={activeWorkspace === 'operational'}
          onClick={() => setActiveWorkspace('operational')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          id="macro"
          label="Macro_Cognition"
          icon={Globe}
          isActive={activeWorkspace === 'macro'}
          onClick={() => setActiveWorkspace('macro')}
          isCollapsed={isCollapsed}
        />
      </div>

      <div className="py-4 border-t border-slate-900/50 flex flex-col gap-1">
        <SidebarItem
          id="settings"
          label="System_Config"
          icon={Settings}
          isActive={false}
          onClick={() => {}}
          isCollapsed={isCollapsed}
        />
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-indigo-400 transition-colors"
        >
          <Maximize2 size={16} />
          {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Focus_Mode</span>}
        </button>
      </div>
    </motion.aside>
  );
};
