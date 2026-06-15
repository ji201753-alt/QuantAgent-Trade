import React from 'react';
import { Panel } from '../layout/Panel';
import { useTerminalStore } from '../../state/terminalState';

export const InvestigationPanel: React.FC = () => {
  const { activeInvestigation, replayMode, activeOverlays, activeWorkspaceId, setInvestigation, saveInvestigation, captureSnapshot } = useTerminalStore();
  const investigation = activeInvestigation || {
    id: 'local-session',
    title: 'No persisted investigation selected',
    replayTime: replayMode.currentTime,
    activeOverlays,
    pinnedEvidence: [],
    reasoningHistory: [],
    workspaceId: activeWorkspaceId,
  };

  const annotate = () => {
    captureSnapshot();
    setInvestigation({
      ...investigation,
      replayTime: replayMode.currentTime,
      activeOverlays,
      workspaceId: activeWorkspaceId,
      pinnedEvidence: [...(investigation.pinnedEvidence || []), `snapshot:${new Date().toISOString()}`],
    });
  };

  const exportReport = () => {
    saveInvestigation();
    const blob = new Blob([JSON.stringify(useTerminalStore.getState().activeInvestigation || investigation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${investigation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Panel title="Active Investigation & Case Management">
      <div className="p-3 font-mono text-[10px] space-y-4 overflow-y-auto h-full">
        <div className="bg-indigo-600 p-2 rounded shadow-md border border-indigo-500/50">
           <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-black text-indigo-100 uppercase">Case_Active</span>
              <span className="text-[7px] text-indigo-200">#{investigation.id}</span>
           </div>
           <div className="text-white font-bold text-sm tracking-tight italic">{investigation.title}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-2 rounded">
           <span className="text-slate-500 font-bold uppercase text-[8px] block mb-2">Replay_Context</span>
           <div className="flex items-center justify-between text-indigo-400">
              <span className="font-bold">{replayMode.currentTime || 'LIVE_STREAM'}</span>
              <button onClick={annotate} className="bg-indigo-500/20 text-indigo-300 px-2 rounded font-black border border-indigo-500/30">SYNC</button>
           </div>
        </div>

        <div className="space-y-2">
           <span className="text-slate-600 font-black uppercase text-[8px]">Case_Evidence_Chain</span>
           {(investigation.pinnedEvidence.length ? investigation.pinnedEvidence : ['No pinned evidence yet']).map((e, i) => (
             <div key={i} className="bg-slate-950 p-1.5 border-l border-slate-800 text-slate-300 italic group hover:bg-slate-900 transition-colors">
                "{e}"
             </div>
           ))}
        </div>

        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
           <button onClick={annotate} className="bg-slate-800 text-slate-100 font-black uppercase text-[8px] py-1.5 rounded hover:bg-slate-700 transition-all">Annotate</button>
           <button onClick={exportReport} className="bg-white text-black font-black uppercase text-[8px] py-1.5 rounded hover:bg-slate-200 transition-all">Export_Report</button>
        </div>
      </div>
    </Panel>
  );
};
