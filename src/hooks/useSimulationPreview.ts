import { useMemo } from 'react';
import { getSimulationById } from '../registry/simulationRegistry';
import { useLabStore } from '../stores/useLabStore';
import { encodeSimulationPermalink } from '../utils/formatters';

export function useSimulationPreview(simulationId: string) {
  const simulation = useMemo(() => getSimulationById(simulationId), [simulationId]);
  const previewParamsBySim = useLabStore((s) => s.previewParamsBySim);
  const setPreviewParam = useLabStore((s) => s.setPreviewParam);
  const resetPreviewParams = useLabStore((s) => s.resetPreviewParams);

  const params = useMemo(() => {
    const defaults: Record<string, number> = {};
    simulation?.parameters.forEach((p) => {
      defaults[p.key] = p.defaultValue;
    });
    return { ...defaults, ...(previewParamsBySim[simulationId] ?? {}) };
  }, [simulation, previewParamsBySim, simulationId]);

  const permalink = useMemo(
    () => (typeof window !== 'undefined' ? encodeSimulationPermalink(simulationId, params) : ''),
    [simulationId, params]
  );

  return {
    simulation,
    params,
    permalink,
    updateParam: (key: string, value: number) => setPreviewParam(simulationId, key, value),
    resetParams: () => resetPreviewParams(simulationId),
  };
}
