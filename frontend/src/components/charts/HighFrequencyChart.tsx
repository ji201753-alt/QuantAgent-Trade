import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, SeriesMarker } from 'lightweight-charts';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';

interface ChartProps {
  data?: any[];
}

export const HighFrequencyChart: React.FC<ChartProps> = ({ data }) => {
  const { marketData, marketContext } = useTerminalStore();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
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

    seriesRef.current = candleSeries;

    // Initial data load simulation
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      time: (Date.now() / 1000 - (100 - i) * 60) as any,
      open: 0.5400 + Math.random() * 0.01,
      high: 0.5410 + Math.random() * 0.01,
      low: 0.5390 + Math.random() * 0.01,
      close: 0.5405 + Math.random() * 0.01,
    }));
    candleSeries.setData(mockData);

    // 3. Kronos Structural Cognitive Markers
    const markers: SeriesMarker<any>[] = [
      {
        time: mockData[ mockData.length - 20 ].time,
        position: 'aboveBar',
        color: theme.colors.semantic.instability,
        shape: 'arrowDown',
        text: 'Structural_Recurrence_Match',
      },
      {
        time: mockData[ mockData.length - 10 ].time,
        position: 'belowBar',
        color: theme.colors.semantic.info,
        shape: 'circle',
        text: 'Regime_Transition',
      }
    ];
    candleSeries.setMarkers(markers);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div className="w-full h-full relative">
       <div ref={chartContainerRef} className="w-full h-full" />
       {/* High-frequency overlay labels */}
       <div className="absolute top-2 left-3 flex items-baseline gap-2 pointer-events-none">
          <span className="text-xl font-black font-mono text-slate-100 tracking-tighter">0.5421</span>
          <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1 rounded">+0.04%</span>
       </div>
    </div>
  );
};
