import React from 'react';
import { motion } from 'framer-motion';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { Cpu, Activity, Database, ShieldCheck, Zap } from 'lucide-react';

const DiagnosticRow: React.FC<{ label: string; value: string | number; sub?: string; color?: string }> = ({ label, value, sub, color = 'text-indigo-400' }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/[0.03]">
    <div className="flex flex-col">
       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
       {sub && <span className="text-[7px] text-slate-600 font-bold uppercase">{sub}</span>}
    </div>
    <span className={`text-[10px] font-mono font-bold ${color}`}>{value}</span>
  </div>
);

export const RuntimeDiagnosticsPanel: React.FC = () => {
  return (
    <CinematicPanel title="Operational_Runtime_Diagnostics">
      <div className="p-4 space-y-6 overflow-y-auto h-full">
         {/* Inference Engine */}
         <section>
            <div className="flex items-center gap-2 mb-3">
               <Zap size={14} className="text-indigo-400" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Forecasting_Inference_Engine</h3>
            </div>
            <DiagnosticRow label="TimesFM_Engine" value="ACTIVE_GPU" sub="Local_Inference" />
            <DiagnosticRow label="Inference_Lat" value="42.5ms" sub="Rolling_Average" color="text-green-400" />
            <DiagnosticRow label="Model_Status" value="SYNCED" sub="Checkpoint_V1.0" />
         </section>

         {/* Cognitive Indexing */}
         <section>
            <div className="flex items-center gap-2 mb-3">
               <Database size={14} className="text-amber-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Structural_Memory_Indexing</h3>
            </div>
            <DiagnosticRow label="Kronos_Store" value="14,241" sub="Archived_Archetypes" />
            <DiagnosticRow label="Indexing_Rate" value="1.2 msg/s" sub="Live_Persistence" />
            <DiagnosticRow label="Search_Latency" value="12ms" sub="Similarity_HNSW" color="text-green-400" />
         </section>

         {/* Hardware Telemetry */}
         <section className="bg-slate-900/30 p-3 rounded border border-white/5">
            <div className="flex items-center gap-2 mb-3">
               <Cpu size={14} className="text-slate-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Hardware_Acceleration</h3>
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
                  <span className="text-[8px] text-slate-600 font-black uppercase">MEM_USAGE</span>
                  <div className="text-xs font-mono font-black text-white">8.4GB</div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                     <motion.div animate={{ width: '68%' }} className="h-full bg-indigo-500" />
                  </div>
               </div>
            </div>
         </section>
      </div>
    </CinematicPanel>
  );
};
