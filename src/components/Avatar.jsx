import { useMemo } from 'react';

/**
 * Avatar - 简洁专业的品牌头像
 * - 圆形容器 + 渐变背景 + 内描边
 * - 中心字母：小尺寸显示 "P"，≥64px 显示 "PV"
 * - ≥48px 自动显示：淡网格与像素角标
 * - 通过 userId 稳定生成配色变体（A/B/C）
 */
function hashString(s = '') {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pickVariant(hash) {
  const variants = ['A', 'B', 'C'];
  return variants[hash % variants.length];
}

export default function Avatar({ size = 48, userId = 'guest', title = 'Profile' }) {
  const variant = useMemo(() => pickVariant(hashString(userId)), [userId]);
  const showDetails = size >= 48;
  const showPV = size >= 64;

  // 颜色方案（浅色主题背景，深色主题自动由容器环境决定）
  const gradient = useMemo(() => {
    switch (variant) {
      case 'A':
        return { id: 'gradA', stops: [
          { offset: '0%', color: '#3B82F6' }, // blue
          { offset: '100%', color: '#A78BFA' } // purple
        ], angle: 60 };
      case 'B':
        return { id: 'gradB', stops: [
          { offset: '0%', color: '#06B6D4' }, // cyan
          { offset: '100%', color: '#3B82F6' } // blue
        ], angle: 30 };
      default:
        return { id: 'gradC', stops: [
          { offset: '0%', color: '#A78BFA' }, // purple
          { offset: '100%', color: '#F472B6' } // pink
        ], angle: 120 };
    }
  }, [variant]);

  const strokeColor = '#00000014'; // 内描边（极淡）
  const textColor = '#F8FAFC';     // 字母颜色（近白）
  const gridColor = '#FFFFFF22';   // 淡网格
  const pixelAccent = '#111827';   // 角标深色块（可读）

  const r = size / 2;
  const padding = Math.max(1, Math.round(size * 0.04));
  const viewBox = `0 0 ${size} ${size}`;

  const text = showPV ? 'PV' : 'P';
  const fontSize = showPV ? size * 0.45 : size * 0.55;
  const fontWeight = 800;

  // 渐变角度转坐标
  const angleRad = (gradient.angle * Math.PI) / 180;
  const x1 = 0.5 - Math.cos(angleRad) / 2;
  const y1 = 0.5 - Math.sin(angleRad) / 2;
  const x2 = 0.5 + Math.cos(angleRad) / 2;
  const y2 = 0.5 + Math.sin(angleRad) / 2;

  // 网格间距（像素感）
  const gridStep = Math.max(6, Math.round(size / 8));

  // 角标尺寸：3x3 像素块（基于步长）
  const px = gridStep * 0.7;
  const cornerSize = Math.max(3, Math.round(px));
  const cornerMargin = Math.max(2, Math.round(gridStep * 0.3));

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      aria-label={title}
      role="img"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradient.id} x1={x1} y1={y1} x2={x2} y2={y2}>
          {gradient.stops.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>

        {showDetails && (
          <pattern id="avatarGrid" width={gridStep} height={gridStep} patternUnits="userSpaceOnUse">
            <rect width={gridStep} height={gridStep} fill="transparent" />
            <path d={`M 0 ${gridStep} L ${gridStep} ${gridStep} M ${gridStep} 0 L ${gridStep} ${gridStep}`} stroke={gridColor} strokeWidth="1" />
          </pattern>
        )}
      </defs>

      {/* 背景圆 */}
      <circle cx={r} cy={r} r={r - padding} fill={`url(#${gradient.id})`} stroke={strokeColor} strokeWidth="1" />

      {/* 淡网格（仅大尺寸） */}
      {showDetails && (
        <circle cx={r} cy={r} r={r - padding - 1} fill="url(#avatarGrid)" />
      )}

      {/* 中央字母 */}
      <text
        x="50%"
        y="50%"
        fill={textColor}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"' }}
      >
        {text}
      </text>

      {/* 像素角标（右下，≥48px） */}
      {showDetails && (
        <g>
          <rect
            x={size - cornerSize - cornerMargin}
            y={size - cornerSize - cornerMargin}
            width={cornerSize}
            height={cornerSize}
            fill={pixelAccent}
            opacity="0.9"
            rx="1"
          />
          <rect
            x={size - (cornerSize * 2) - cornerMargin - 1}
            y={size - cornerSize - cornerMargin}
            width={cornerSize}
            height={cornerSize}
            fill={pixelAccent}
            opacity="0.65"
            rx="1"
          />
          <rect
            x={size - cornerSize - cornerMargin}
            y={size - (cornerSize * 2) - cornerMargin - 1}
            width={cornerSize}
            height={cornerSize}
            fill={pixelAccent}
            opacity="0.65"
            rx="1"
          />
        </g>
      )}
    </svg>
  );
}