import React, { useEffect, useRef } from 'react';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';

interface OverlayOrchestratorProps {
  chart: IChartApi;
  mainSeries: ISeriesApi<"Candlestick">;
}

export const OverlayOrchestrator: React.FC<OverlayOrchestratorProps> = ({ chart, mainSeries }) => {
  const { activeOverlays, marketData, kronos } = useTerminalStore();
  const seriesRefs = useRef<Map<string, ISeriesApi<any>>>(new Map());

  useEffect(() => {
    const activeIds = new Set(activeOverlays);

    // 1. Precise Cleanup of removed overlays
    for (const [id, series] of seriesRefs.current.entries()) {
      const type = id.split('_')[0];
      if (!activeIds.has(type)) {
        chart.removeSeries(series);
        seriesRefs.current.delete(id);
      }
    }

    // 2. TimesFM Probabilistic Envelopes
    if (activeIds.has('forecast')) {
       const meanId = 'forecast_mean';
       if (!seriesRefs.current.has(meanId)) {
         const meanSeries = chart.addLineSeries({
           color: theme.colors.semantic.pressure,
           lineWidth: 2,
           title: 'TimesFM_Mean'
         });
         seriesRefs.current.set(meanId, meanSeries);
       }
       // Additional confidence bounds would be handled here
    }

    // 3. Kronos Structural Shadow Paths
    if (activeIds.has('analogs')) {
       kronos.activeAnalogs.forEach((analog) => {
         const id = `analogs_${analog.analog_id}`;
         if (!seriesRefs.current.has(id)) {
            const series = chart.addLineSeries({
              color: theme.colors.semantic.confidence,
              lineWidth: 1,
              lineStyle: 2,
              title: `Analog_${analog.analog_id}`,
              lastValueVisible: false,
              priceLineVisible: false,
            });
            if (analog.trajectory) series.setData(analog.trajectory);
            seriesRefs.current.set(id, series);
         }
       });
    }

    return () => {
      // Full cleanup on unmount
      seriesRefs.current.forEach(s => chart.removeSeries(s));
      seriesRefs.current.clear();
    };
  }, [activeOverlays, chart, marketData, kronos.activeAnalogs]);

  return null;
};
