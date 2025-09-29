import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { downscaleFileToBlob, loadImageFromFile } from '../utils/resizeImage';
import { PREVIEW_LIMIT } from '../utils/constants';

function ToolSection({ onImageUpload, headingLevel = 'h1', enablePaste = true }) {
  const { t } = useTranslation()
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [compact, setCompact] = useState(false);
  const lastUrlRef = useRef(null);
  const pasteGuardRef = useRef(0);

  useEffect(() => {
    const evaluate = () => setCompact(window.innerHeight <= 900);
    evaluate();
    window.addEventListener('resize', evaluate);
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  const handleFileSelect = useCallback(async (file) => {
    setError(''); // 新交互开始时主动清理旧错误
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        setError(t('errors.fileTooLarge10'));
        return;
      }
      // 预检图片尺寸，如过大则先在前端做等比 contain 下采样以便预览/编辑
      const MAX_PREVIEW_DIM = PREVIEW_LIMIT.maxEdge;
      try {
        const { img, url: tmpUrl } = await loadImageFromFile(file);
        const needsDownscale = Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height) > MAX_PREVIEW_DIM;
        URL.revokeObjectURL(tmpUrl);
        let finalUrl;
        if (needsDownscale) {
          const blob = await downscaleFileToBlob(file, MAX_PREVIEW_DIM, { preferPng: file.type === 'image/png', quality: 0.9, pixelated: false });
          finalUrl = URL.createObjectURL(blob);
        } else {
          finalUrl = URL.createObjectURL(file);
        }
        if (lastUrlRef.current) {
          try { URL.revokeObjectURL(lastUrlRef.current); } catch (e) { if (import.meta?.env?.DEV) console.warn('revokeObjectURL failed', e) }
        }
        lastUrlRef.current = finalUrl;
        onImageUpload(finalUrl);
        const live = document.getElementById('upload-live');
        if (live) live.textContent = t('upload.selected', { name: file.name });
      } catch (e) {
        setError(t('errors.prepareFail'));
        if (import.meta?.env?.DEV) console.error(e);
      }
    }
  }, [onImageUpload, t]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setError('');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [handleFileSelect]);

  // 覆盖首页的粘贴上传（当编辑器未激活时才监听，避免与 Editor 双重绑定）
  useEffect(() => {
    if (!enablePaste) return;
    const onPaste = (e) => {
      // 简单去重：1s 内只处理一次
      const now = Date.now();
      if (now - (pasteGuardRef.current || 0) < 1000) return;
      const files = Array.from(e.clipboardData?.files || []);
      if (files.length) {
        e.preventDefault();
        pasteGuardRef.current = now;
        handleFileSelect(files[0]);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFileSelect, enablePaste]);

  const handleClick = useCallback(() => {
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

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
          className={`upload-zone max-w-3xl mx-auto bg-white ${compact?'p-6':'p-8'} border-2 border-dashed border-gray-300 rounded-xl transition-all hover:border-blue-500 hover:bg-blue-50`}
          role="button"
          tabIndex={0}
          aria-labelledby="upload-instructions"
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
            onChange={handleFileInputChange}
            onClick={(e)=>{ e.target.value=''; }}
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
              <button type="button" className="btn-primary" data-testid="choose-file-btn" onClick={handleClick}>{t('tool.chooseFile')}</button>
            </div>
            <p id="upload-live" className="sr-only" aria-live="polite" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ToolSection;
