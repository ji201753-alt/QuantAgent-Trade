import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi } from 'lightweight-charts';

interface ChartProps {
  data: any[];
}

export const HighFrequencyChart: React.FC<ChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
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
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
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
