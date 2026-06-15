import React, { useEffect, useRef } from 'react';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';

interface OverlayOrchestratorProps {
  chart: IChartApi;
  mainSeries: ISeriesApi<"Candlestick">;
}

const horizonToSeconds = (horizon: string): number => {
  const match = /^(\d+)(s|m|h)$/i.exec(horizon || '');
  if (!match) return 0;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === 'h') return value * 3600;
  if (unit === 'm') return value * 60;
  return value;
};

export const OverlayOrchestrator: React.FC<OverlayOrchestratorProps> = ({ chart, mainSeries }) => {
  const { marketStructure } = useTerminalStore();
  const seriesRefs = useRef<Map<string, ISeriesApi<any>>>(new Map());

  useEffect(() => {
    return () => {
      seriesRefs.current.forEach(s => chart.removeSeries(s));
      seriesRefs.current.clear();
    };
  }, [chart]);

  useEffect(() => {
    const activeIds = new Set(marketStructure.overlayOrder);

    for (const [id, series] of seriesRefs.current.entries()) {
      const type = id.split('_')[0];
      if (!activeIds.has(type)) {
        chart.removeSeries(series);
        seriesRefs.current.delete(id);
      }
    }

    if (activeIds.has('forecast')) {
      const meanId = 'forecast_mean';
      let meanSeries = seriesRefs.current.get(meanId);
      if (!meanSeries) {
        meanSeries = chart.addLineSeries({
          color: theme.colors.semantic.pressure,
          lineWidth: 2,
          title: 'TimesFM_Mean',
          lastValueVisible: false,
          priceLineVisible: false,
        });
        seriesRefs.current.set(meanId, meanSeries);
      }
      const forecastData = (marketStructure.forecasts.active || [])
        .map((forecast: any) => {
          const baseTime = Math.floor(new Date(forecast.timestamp).getTime() / 1000);
          return {
            time: (baseTime + horizonToSeconds(forecast.horizon)) as any,
            value: Number(forecast.prediction),
          };
        })
        .filter((point: any) => Number.isFinite(point.time) && Number.isFinite(point.value))
        .sort((a: any, b: any) => a.time - b.time);
      meanSeries.setData(forecastData);
    }


    if (activeIds.has('zones')) {
      const zoneId = 'zones_mid_liquidity';
      let zoneSeries = seriesRefs.current.get(zoneId);
      if (!zoneSeries) {
        zoneSeries = chart.addLineSeries({
          color: theme.colors.semantic.info,
          lineWidth: 1,
          lineStyle: 2,
          title: 'Microstructure_Mid_Liquidity',
          lastValueVisible: false,
          priceLineVisible: false,
        });
        seriesRefs.current.set(zoneId, zoneSeries);
      }
      const zoneData = (marketStructure.activeFrames || [])
        .map((frame: any) => ({
          time: Math.floor(new Date(frame.timestamp).getTime() / 1000) as any,
          value: Number(frame.mid_price),
        }))
        .filter((point: any) => Number.isFinite(point.time) && Number.isFinite(point.value) && point.value > 0)
        .sort((a: any, b: any) => a.time - b.time);
      zoneSeries.setData(zoneData);
    }

    if (activeIds.has('analogs')) {
      const activeAnalogIds = new Set(marketStructure.kronos.activeAnalogs.map((analog: any) => `analogs_${analog.analog_id}`));
      for (const [id, series] of seriesRefs.current.entries()) {
        if (id.startsWith('analogs_') && !activeAnalogIds.has(id)) {
          chart.removeSeries(series);
          seriesRefs.current.delete(id);
        }
      }
      marketStructure.kronos.activeAnalogs.forEach((analog: any) => {
        const id = `analogs_${analog.analog_id}`;
        let series = seriesRefs.current.get(id);
        if (!series) {
          series = chart.addLineSeries({
            color: theme.colors.semantic.confidence,
            lineWidth: 1,
            lineStyle: 2,
            title: `Analog_${analog.analog_id}`,
            lastValueVisible: false,
            priceLineVisible: false,
          });
          seriesRefs.current.set(id, series);
        }
        series.setData(analog.trajectory || []);
      });
    }
  }, [chart, marketStructure.forecasts.active, marketStructure.activeFrames, marketStructure.overlayOrder, marketStructure.kronos.activeAnalogs]);

  return null;
};
