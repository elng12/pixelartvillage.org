import React from 'react';

/**
 * WplaceFeaturesSection
 * - 复刻你提供的四列功能版式（标题、说明、四个特性卡片）
 * - 文案与元素聚焦 Wplace 主题
 * - 不使用外链资源，图标为内联 SVG，保证 CSP 通过
 * - 间距/字号/配色与现有 FeaturesSection 保持一致的视觉节奏
 */
function CircleIcon({ bg, children, title }) {
  return (
    <div
      className="mx-auto grid place-items-center rounded-full"
      aria-hidden
      style={{
        width: 56, height: 56,
        backgroundColor: bg,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
      }}
      title={title}
    >
      {children}
    </div>
  );
}

// 内联简洁图标（与截图风格一致：线性/简约）
const IconDollar = ({ className = 'h-6 w-6 text-emerald-600' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 1v22" />
    <path d="M17 5c0 2.5-2.5 3.5-5 3.8S7 9.6 7 12s2.5 3.5 5 3.8 5 1.3 5 3.7" />
  </svg>
);

const IconLock = ({ className = 'h-6 w-6 text-blue-600' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const IconSmile = ({ className = 'h-6 w-6 text-violet-600' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M9 9h.01M15 9h.01" />
  </svg>
);

const IconImage = ({ className = 'h-6 w-6 text-amber-600' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="14" rx="2" />
    <path d="M8 11l3-3 5 6H6l2-3z" />
    <circle cx="8.5" cy="7.5" r="1.5" />
  </svg>
);

export default function WplaceFeaturesSection() {
  return (
    <section id="wplace-features" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* 标题与副标题：与当前站点层级一致 */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
          Perfect Tool for Pixel Art Village Users
        </h2>
        <p className="mt-2 text-center text-gray-600 max-w-3xl mx-auto leading-relaxed">
          The ultimate companion for Pixel Art Village — convert any image into clean pixel art with real‑time preview, smart palettes, and instant export.
        </p>

        {/* 四列特性：保持等间距与卡片风格一致 */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-center h-full">
            <CircleIcon bg="rgba(16,185,129,0.12)" title="100% Free">
              <IconDollar />
            </CircleIcon>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">100% Free</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Completely free for all Pixel Art Village users. No hidden costs or subscriptions — create unlimited pixel art.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-center h-full">
            <CircleIcon bg="rgba(59,130,246,0.12)" title="Privacy First">
              <IconLock />
            </CircleIcon>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Privacy First</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">
              All processing happens in your browser. Your images never leave your device — perfect for Pixel Art Village users who value privacy.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-center h-full">
            <CircleIcon bg="rgba(139,92,246,0.12)" title="Easy for All Players">
              <IconSmile />
            </CircleIcon>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Easy for All Players</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Intuitive interface tuned for Pixel Art Village workflows. Convert any image to paintable pixel art in just a few clicks.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-center h-full">
            <CircleIcon bg="rgba(245,158,11,0.12)" title="No Size Limits">
              <IconImage />
            </CircleIcon>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Size Limits</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Upload images of any size — from tiny icons to large artwork. Pixel Art Village handles scaling smoothly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}