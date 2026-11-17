export function formatScientificValue(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '0.00';
  return value.toFixed(decimals);
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export function encodeSimulationPermalink(
  simulationId: string,
  params: Record<string, number>
): string {
  const search = new URLSearchParams();
  search.set('sim', simulationId);
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `${window.location.origin}/?${search.toString()}`;
}

export function downloadCsvFile(filename: string, rows: Array<Record<string, string | number>>): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const cell = String(row[h] ?? '');
          return cell.includes(',') ? `"${cell}"` : cell;
        })
        .join(',')
    ),
  ];
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
