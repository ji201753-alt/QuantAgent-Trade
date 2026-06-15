import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi, SeriesMarker, IChartApi } from 'lightweight-charts';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';
import { OverlayOrchestrator } from './OverlayOrchestrator';
import { MicrostructureRenderOverlay } from './MicrostructureRenderOverlay';

interface ChartProps {
  data?: any[];
}

export const HighFrequencyChart: React.FC<ChartProps> = ({ data }) => {
  const { marketData } = useTerminalStore();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<IChartApi | null>(null);
  const [mainSeries, setMainSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      crosshair: {
        mode: 0,
        vertLine: { color: theme.colors.semantic.confidence, labelBackgroundColor: theme.colors.semantic.confidence },
        horzLine: { color: theme.colors.semantic.confidence, labelBackgroundColor: theme.colors.semantic.confidence },
      },
      handleScroll: true,
      handleScale: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
        fontSize: 10,
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      },
      grid: {
        vertLines: { color: '#0f172a' },
        horzLines: { color: '#0f172a' },
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
        secondsVisible: true,
      },
      rightPriceScale: {
        borderColor: '#1e293b',
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: theme.colors.semantic.success,
      downColor: theme.colors.semantic.error,
      borderVisible: false,
      wickUpColor: theme.colors.semantic.success,
      wickDownColor: theme.colors.semantic.error,
    });

    // 1. Structural Zones Layer (Liquidity/Vol)
    const structuralLayer = chart.addLineSeries({
      color: theme.colors.semantic.confidence,
      lineWidth: 1,
      lineStyle: 2, // Dashed
    });

    // 2. Probabilistic Trajectory Layer
    const forecastLayer = chart.addLineSeries({
      color: theme.colors.semantic.pressure,
      lineWidth: 2,
    });

    setChartInstance(chart);
    setMainSeries(candleSeries);

    candleSeries.setData([]);
    candleSeries.setMarkers([]);

    chart.subscribeClick((param) => {
      if (param.time) {
        console.log(`Chart click at ${param.time}`);
        // Synchronize context focus or investigation bookmark
      }
    });

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!mainSeries) return;
    const sourceData = data || marketData.candles || [];
    const candleData = sourceData.map((d: any) => ({
      time: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
    mainSeries.setData(candleData);
  }, [data, mainSeries, marketData.candles]);

  return (
    <div className="w-full h-full relative">
       <div ref={chartContainerRef} className="w-full h-full" />

       {chartInstance && mainSeries && (
          <OverlayOrchestrator chart={chartInstance} mainSeries={mainSeries} />
       )}
       <MicrostructureRenderOverlay />
       {/* High-frequency overlay labels */}
       <div className="absolute top-2 left-3 flex items-baseline gap-2 pointer-events-none">
          <span className="text-xl font-black font-mono text-slate-100 tracking-tighter">{marketData?.metrics?.pressure?.toFixed?.(4) || 'N/A'}</span>
          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">LIVE_DATA_REQUIRED</span>
       </div>
    </div>
  );
};
