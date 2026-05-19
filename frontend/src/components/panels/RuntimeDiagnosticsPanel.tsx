import React from 'react';
import { motion } from 'framer-motion';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { Cpu, Activity, Database, ShieldCheck, Zap, RefreshCw, AlertTriangle } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';

const DiagnosticRow: React.FC<{ label: string; value: string | number; sub?: string; color?: string; isDegraded?: boolean }> = ({ label, value, sub, color = 'text-indigo-400', isDegraded }) => (
  <div className={`flex justify-between items-center py-2 border-b border-white/[0.03] ${isDegraded ? 'bg-red-500/5' : ''}`}>
    <div className="flex flex-col">
       <div className="flex items-center gap-2">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
          {isDegraded && <AlertTriangle size={10} className="text-red-500 animate-pulse" />}
       </div>
       {sub && <span className="text-[7px] text-slate-600 font-bold uppercase">{sub}</span>}
    </div>
    <span className={`text-[10px] font-mono font-bold ${isDegraded ? 'text-red-500' : color}`}>{value}</span>
  </div>
);

export const RuntimeDiagnosticsPanel: React.FC = () => {
  const { stats } = useTerminalStore();
  const isOverloaded = stats.droppedEvents > 0;

  return (
    <CinematicPanel title="Operational_Runtime_Diagnostics">
      <div className="p-4 space-y-6 overflow-y-auto h-full">
         {/* Inference Engine Orchestration */}
         <section>
            <div className="flex items-center gap-2 mb-3">
               <Zap size={14} className="text-indigo-400" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Model_Runtime_Orchestration</h3>
            </div>
            <DiagnosticRow label="TimesFM_Runtime" value="ACTIVE_GPU" sub="Local_Inference" />
            <DiagnosticRow label="Inference_Lat" value="42.5ms" sub="Rolling_Average" color="text-green-400" />
            <DiagnosticRow label="Queue_Pressure" value={isOverloaded ? "HIGH" : "NOMINAL"} sub="Inference_Queue" isDegraded={isOverloaded} />
            <DiagnosticRow label="Replay_Sync" value="LOCKED" sub="Deterministic_Mode" color="text-cyan-400" />
         </section>

         {/* Cognitive Indexing Diagnostics */}
         <section>
            <div className="flex items-center gap-2 mb-3">
               <Database size={14} className="text-amber-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Structural_Memory_Runtime</h3>
            </div>
            <DiagnosticRow label="Kronos_Core" value="ACTIVE" sub="Indexing_Live" />
            <DiagnosticRow label="Search_Latency" value="12ms" sub="Similarity_HNSW" color="text-green-400" />
         </section>

         {/* Hardware Acceleration Visibility */}
         <section className="bg-slate-900/30 p-3 rounded border border-white/5">
            <div className="flex items-center gap-2 mb-3">
               <Cpu size={14} className="text-slate-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Hardware_Resource_Utilization</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <span className="text-[8px] text-slate-600 font-black uppercase">GPU_UTIL</span>
                  <div className="text-xs font-mono font-black text-white">42%</div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                     <motion.div animate={{ width: '42%' }} className="h-full bg-indigo-500" />
                  </div>
               </div>
               <div className="space-y-1">
                  <span className="text-[8px] text-slate-600 font-black uppercase">VRAM_LOAD</span>
                  <div className="text-xs font-mono font-black text-white">8.4GB</div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                     <motion.div animate={{ width: '68%' }} className="h-full bg-indigo-500" />
                  </div>
               </div>
            </div>
         </section>

         <div className="pt-2 flex justify-between">
            <button className="flex items-center gap-2 text-[9px] font-black uppercase text-indigo-400 hover:text-white transition-colors">
               <RefreshCw size={10} /> Recalibrate_Inference
            </button>
            <span className="text-[7px] text-slate-700 font-black uppercase tracking-tighter">RC_VERSION: 1.7.0_STABLE</span>
         </div>
      </div>
    </CinematicPanel>
  );
};
