// File: src/components/analytics/Sparkline.jsx
const STATUS_STROKE = { normal: '#10B981', warning: '#F59E0B', critical: '#EF4444' };
const VIEW_WIDTH = 100;

export function Sparkline({ data, status, height = 40 }) {
  if (data.length < 2) {
    return <div style={{ height }} className="w-full" aria-hidden="true" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * VIEW_WIDTH;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${VIEW_WIDTH},${height}`;
  const stroke = STATUS_STROKE[status];

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
      preserveAspectRatio="none"
      className="h-10 w-full"
      role="img"
      aria-label="Recent trend"
    >
      <polyline points={areaPoints} fill={stroke} opacity={0.08} stroke="none" />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
