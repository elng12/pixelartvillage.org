import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { downscaleFileToBlob, loadImageFromFile } from '../utils/resizeImage';
import { PREVIEW_LIMIT } from '../utils/constants';

// 常量定义
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const PASTE_GUARD_MS = 1000; // 1秒防重复
const ERROR_TYPES = {
  FILE_TYPE: 'file-type',
  FILE_SIZE: 'file-size',
  PROCESSING: 'processing'
};

function ToolSection({ onImageUpload, headingLevel = 'h1', enablePaste = true }) {
  const { t } = useTranslation()
  const fileInputRef = useRef(null);
  const uploadLiveRef = useRef(null); // 替代getElementById
  const [error, setError] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);
  const [compact, setCompact] = useState(false);
  const lastUrlRef = useRef(null);
  const pasteGuardRef = useRef(0);
  const log = useCallback((event, payload = {}) => {
    if (import.meta?.env?.DEV) {
       
      console.log(`[ToolSection] ${event}`, payload);
    }
  }, []);

  useEffect(() => {
    const evaluate = () => setCompact(window.innerHeight <= 900);
    evaluate();
    window.addEventListener('resize', evaluate);
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  const handleFileSelect = useCallback(async (file) => {
    if (isPreparing) return;
    setError(''); // Reset stale error when starting a new interaction
    log('handleFileSelect:start', {
      hasFile: !!file,
      name: file?.name,
      type: file?.type,
      size: file?.size,
    });
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(t('errors.onlyPngJpg'));
      log('handleFileSelect:reject-non-image', { 
        name: file.name, 
        type: file.type,
        errorType: ERROR_TYPES.FILE_TYPE 
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(t('errors.fileTooLarge10'));
      log('handleFileSelect:reject-too-large', { 
        name: file.name, 
        size: file.size,
        errorType: ERROR_TYPES.FILE_SIZE 
      });
      return;
    }
    setIsPreparing(true);
    // Downscale oversized images in the browser to keep previews responsive
    const MAX_PREVIEW_DIM = PREVIEW_LIMIT.maxEdge;
    try {
      const { img, url: tmpUrl } = await loadImageFromFile(file);
      const needsDownscale = Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height) > MAX_PREVIEW_DIM;
      URL.revokeObjectURL(tmpUrl);
      let finalUrl;
      if (needsDownscale) {
        const blob = await downscaleFileToBlob(file, MAX_PREVIEW_DIM, { preferPng: file.type === 'image/png', quality: 0.9, pixelated: false });
        finalUrl = URL.createObjectURL(blob);
        log('handleFileSelect:downscaled', { name: file.name, original: { w: img.naturalWidth, h: img.naturalHeight }, limit: MAX_PREVIEW_DIM });
      } else {
        finalUrl = URL.createObjectURL(file);
        log('handleFileSelect:use-original', { name: file.name });
      }
      if (lastUrlRef.current) {
        try { 
          URL.revokeObjectURL(lastUrlRef.current); 
        } catch (e) { 
          if (import.meta?.env?.DEV) {
            log('revokeObjectURL:failed', { error: e?.message });
          }
        }
      }
      lastUrlRef.current = finalUrl;
      log('onImageUpload:call', { finalUrl });
      onImageUpload(finalUrl);
      log('onImageUpload:success', { finalUrl });
      log('handleFileSelect:uploaded', { name: file.name, url: finalUrl });
      if (uploadLiveRef.current) {
        uploadLiveRef.current.textContent = t('upload.selected', { name: file.name });
      }
    } catch (e) {
      setError(t('errors.prepareFail'));
      if (import.meta?.env?.DEV) {
        log('handleFileSelect:error-details', { 
          name: file?.name, 
          error: e?.message,
          stack: e?.stack,
          errorType: ERROR_TYPES.PROCESSING
        });
      }
      log('handleFileSelect:error', { 
        name: file?.name, 
        message: e?.message,
        errorType: ERROR_TYPES.PROCESSING
      });
    } finally {
      setIsPreparing(false);
      log('handleFileSelect:complete', { name: file?.name });
    }
  }, [isPreparing, log, onImageUpload, t]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (isPreparing) return;
    setError('');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      log('drop', { name: file?.name, size: file?.size });
      handleFileSelect(file);
      e.dataTransfer.clearData();
    }
  }, [handleFileSelect, isPreparing, log]);

  // Only enable global paste upload on the landing view to avoid double-binding the Editor listeners
  useEffect(() => {
    if (!enablePaste) return;
    const onPaste = (e) => {
      // Prevent duplicate paste handling within a short interval
      const now = Date.now();
      if (now - (pasteGuardRef.current || 0) < PASTE_GUARD_MS) return;
      const files = Array.from(e.clipboardData?.files || []);
      if (files.length) {
        e.preventDefault();
        pasteGuardRef.current = now;
        const file = files[0];
        log('paste', { name: file?.name, size: file?.size });
        handleFileSelect(file);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFileSelect, enablePaste, log]);

  const handleClick = useCallback(() => {
    if (isPreparing) return;
    setError('');
    fileInputRef.current?.click();
    log('click-open');
  }, [isPreparing, log]);

  const handleFileInputChange = useCallback((e) => {
    if (isPreparing) return;
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      log('input-change', { name: file?.name, size: file?.size });
      handleFileSelect(file);
      // 重置文件输入，允许重复选择同一文件
      e.target.value = '';
    }
  }, [handleFileSelect, isPreparing, log]);

  const handleKeyDown = useCallback((e) => {
    if (isPreparing) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      log('keydown-activate', { key: e.key });
      handleClick();
    }
  }, [handleClick, isPreparing, log]);

  return (
    <section id="tool" className="bg-gray-50 py-6">
      <div className="container mx-auto px-4 text-center">
        {(() => {
          const HeadingTag = headingLevel === 'h2' ? 'h2' : 'h1';
          return (
            <HeadingTag className={`${compact?'text-2xl md:text-4xl':'text-3xl md:text-5xl'} font-extrabold text-gray-800 mb-3 text-center`}>
              {t('tool.title')}
            </HeadingTag>
          );
        })()}
        <div className="mb-6 max-w-4xl md:max-w-5xl mx-auto">
          <p className={`${compact?'text-sm':'text-base'} text-gray-600 mb-2`}>
            {t('tool.subtitle')}
          </p>
          <p className={`${compact?'text-sm':'text-base'} text-gray-600`}>
            {t('tool.subtitle2')}
          </p>
        </div>
        <div 
          className={`upload-zone relative max-w-3xl mx-auto bg-white ${compact?'p-6':'p-8'} border-2 border-dashed border-gray-300 rounded-xl transition-all hover:border-blue-500 hover:bg-blue-50 ${isPreparing ? 'cursor-not-allowed opacity-80 ring-1 ring-blue-200' : ''}`}
          role="button"
          tabIndex={0}
          aria-labelledby="upload-instructions"
          aria-disabled={isPreparing}
          aria-busy={isPreparing}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          data-testid="upload-zone"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            aria-label={t('tool.ariaChoose')}
            disabled={isPreparing}
            onChange={handleFileInputChange}
              data-testid="file-input"
          />
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z" /></svg>
            <h2 id="upload-instructions" className="mt-4 text-xl font-semibold text-gray-700">
              {t('tool.dragOrClick')} <span className="text-blue-600">{t('tool.clickToChoose')}</span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {t('tool.supports')}
            </p>
            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert" aria-live="polite">{error}</p>
            )}
            <div className="mt-4">
              <button
                type="button"
                className={`btn-primary ${isPreparing ? 'opacity-60 cursor-not-allowed' : ''}`}
                data-testid="choose-file-btn"
                onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡
                  handleClick();
                }}
                disabled={isPreparing}
              >
                {t('tool.chooseFile')}
              </button>
            </div>
            <p ref={uploadLiveRef} className="sr-only" aria-live="polite" />
          </div>
          {isPreparing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80" role="status" aria-live="polite" data-testid="upload-preparing">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" aria-hidden="true" />
                <span>{t('tool.preparing')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ToolSection;
