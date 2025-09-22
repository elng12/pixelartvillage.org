<<<<<<< Updated upstream
import { useState, useRef, useEffect } from 'react';
import { processPixelArt } from '../utils/imageProcessor';
import { useDebouncedEffect } from './useDebouncedEffect';

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

  useDebouncedEffect(() => {
    if (!image) {
      setProcessedImage(null);
      return;
    }
    (async () => {
      // 取消上一次处理任务
      try { controllerRef.current?.abort(); } catch { /* ignore */ }
      const controller = new AbortController();
      controllerRef.current = controller;
      const { signal } = controller;
      setIsProcessing(true);
      setError(null);
      try {
        const result = await processPixelArt(image, settings, signal);
        if (!signal.aborted) setProcessedImage(result);
      } catch (error) {
        if (error?.name === 'AbortError') {
          // 忽略被取消的任务
        } else {
          if (import.meta.env?.DEV) console.error('Image processing failed:', error);
          setError(error?.message || 'Image processing failed');
          if (!signal.aborted) setProcessedImage(image);
        }
      } finally {
        if (!signal.aborted) setIsProcessing(false);
      }
    })();
  }, [image, settings], 300);

  return { processedImage, isProcessing, error };
}
=======
import { useState, useRef, useEffect } from 'react';
import { processPixelArt } from '../utils/imageProcessor';

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

  // 依赖变化即刻取消上一次任务；300ms 后开始新处理
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
    }, 300);

    return () => {
      clearTimeout(timer);
      try { controller.abort(); } catch { /* ignore */ }
    };
  }, [image, settings]);

  return { processedImage, isProcessing, error };
}
>>>>>>> Stashed changes
