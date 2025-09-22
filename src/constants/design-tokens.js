// 设计令牌：集中管理布局与颜色，避免魔法数字散落
export const LAYOUT_TOKENS = {
  compact: {
    padding: 'p-2',
    titleSize: 'text-2xl',
    titleMargin: 'mb-4',
    gap: 'gap-2',
    height: 'h-[50vh] sm:h-[60vh]',
  },
  normal: {
    padding: 'p-4',
    titleSize: 'text-3xl',
    titleMargin: 'mb-4',
    gap: 'gap-4',
    height: 'h-[60vh] sm:h-[70vh]',
  },
};

export const COLORS = {
  background: 'bg-gray-50',
  border: 'border-gray-200',
  primary: 'bg-blue-600 hover:bg-blue-700',
};

