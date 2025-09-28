import { useState, useRef, useEffect } from 'react';
// 处理策略说明：尺寸上限（PREVIEW_LIMIT.maxEdge）在 utils/imageProcessor 的主处理链中统一执行：
// 先等比 contain 缩放（避免内存/耗时极端），再执行像素化/调色板量化。
import { processPixelArt } from '../utils/imageProcessor';
import { PROCESS_DEBOUNCE_MS } from '../utils/processing-constants';

export function useImageProcessor(image, settings) {
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  // 当图片变化时，立即设置为原始图片，避免空白显示
  useEffect(() => {
    if (image) {
      setProcessedImage(image);
    } else {
      setProcessedImage(null);
    }
  }, [image]);

  // 依赖变化即刻取消上一次任务；在 PROCESS_DEBOUNCE_MS 后开始新处理（避免频繁开销）
  useEffect(() => {
    // 立即取消上一次
    try { controllerRef.current?.abort(); } catch { /* ignore */ }

    if (!image) {
      setProcessedImage(null);
      setIsProcessing(false);
      return () => {};
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;
    const timer = setTimeout(async () => {
      setIsProcessing(true);
      setError(null);
      try {
        const result = await processPixelArt(image, settings, signal);
        if (!signal.aborted) setProcessedImage(result);
      } catch (err) {
        if (err?.name === 'AbortError') {
          // ignore
        } else {
          if (import.meta.env?.DEV) console.error('Image processing failed:', err);
          setError(err?.message || 'Image processing failed');
          if (!signal.aborted) setProcessedImage(image);
        }
      } finally {
        if (!signal.aborted) setIsProcessing(false);
      }
    }, PROCESS_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      try { controller.abort(); } catch { /* ignore */ }
    };
  }, [image, settings]);

  return { processedImage, isProcessing, error };
}
