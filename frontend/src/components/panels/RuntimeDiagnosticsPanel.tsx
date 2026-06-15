import React from 'react';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { Cpu, Database, Zap, RefreshCw, AlertTriangle } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';
import { useEffect } from 'react';
import { fetchRuntimeTelemetry } from '../../services/api';

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
  const { stats, runtimeTelemetry, setRuntimeTelemetry, marketStructure } = useTerminalStore();
  const isOverloaded = stats.droppedEvents > 0;
  const modelDiag = runtimeTelemetry?.runtime_orchestrator?.timesfm || runtimeTelemetry?.runtime_orchestrator?.diagnostics;
  const eventBus = runtimeTelemetry?.event_bus;
  const timesfmStatus = modelDiag?.status || 'UNKNOWN';
  const device = modelDiag?.device || 'UNKNOWN';
  const latency = modelDiag?.latency_ms ? `${Number(modelDiag.latency_ms).toFixed(2)}ms` : 'N/A';
  const queueDepth = eventBus?.queue_depth ?? 'N/A';

  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      try {
        const telemetry = await fetchRuntimeTelemetry();
        if (mounted) setRuntimeTelemetry(telemetry);
      } catch {
        // keep last known telemetry; avoid fabricating values
      }
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [setRuntimeTelemetry]);

  return (
    <CinematicPanel title="Operational_Runtime_Diagnostics">
      <div className="p-4 space-y-6 overflow-y-auto h-full">
         {/* Inference Engine Orchestration */}
         <section>
            <div className="flex items-center gap-2 mb-3">
               <Zap size={14} className="text-indigo-400" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Model_Runtime_Orchestration</h3>
            </div>
            <DiagnosticRow label="TimesFM_Runtime" value={`${timesfmStatus}_${device}`} sub={modelDiag?.error || 'Runtime_Telemetry'} isDegraded={['ERROR', 'UNAVAILABLE', 'STALE_INFERENCE'].includes(timesfmStatus)} />
            <DiagnosticRow label="Inference_Lat" value={latency} sub="Runtime_Observed" color="text-green-400" />
            <DiagnosticRow label="Queue_Pressure" value={`${queueDepth}`} sub="EventBus_QueueDepth" isDegraded={isOverloaded} />
            <DiagnosticRow label="Replay_Sync" value="UNVERIFIED" sub="Determinism_Audit_Pending" color="text-amber-400" />
         </section>

         {/* Cognitive Indexing Diagnostics */}
         <section>
            <div className="flex items-center gap-2 mb-3">
               <Database size={14} className="text-amber-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Structural_Memory_Runtime</h3>
            </div>
            <DiagnosticRow label="Kronos_Core" value={marketStructure.kronos.status || 'UNKNOWN'} sub={marketStructure.kronos.reason || 'Runtime_Reported'} isDegraded={marketStructure.kronos.status !== 'ACTIVE'} />
            <DiagnosticRow label="Search_Latency" value="UNVERIFIED" sub="Validation_Pending" color="text-amber-400" />
         </section>

         {/* Hardware Acceleration Visibility */}
         <section className="bg-slate-900/30 p-3 rounded border border-white/5">
            <div className="flex items-center gap-2 mb-3">
               <Cpu size={14} className="text-slate-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Hardware_Resource_Utilization</h3>
            </div>
            <div className="text-[9px] text-amber-400 uppercase font-mono">
               Hardware utilization telemetry unavailable until backend GPU/VRAM instrumentation is connected.
            </div>
         </section>

         <div className="pt-2 flex justify-between">
            <button disabled title="Runtime recalibration endpoint is not implemented yet" className="flex items-center gap-2 text-[9px] font-black uppercase text-amber-400/70 cursor-not-allowed">
               <RefreshCw size={10} /> Recalibrate_Unavailable
            </button>
            <span className="text-[7px] text-slate-700 font-black uppercase tracking-tighter">BUILD_STATE: OPERATIONAL_RECOVERY</span>
         </div>
      </div>
    </CinematicPanel>
  );
};
