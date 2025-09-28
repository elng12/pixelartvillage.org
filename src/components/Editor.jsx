import React, { useMemo, useEffect, useRef, useReducer, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useImageProcessor } from '../hooks/useImageProcessor';
import { exportProcessedBlob } from '../utils/imageProcessor';
import { LAYOUT_TOKENS, COLORS } from '../constants/design-tokens';
import Preview from './editor/Preview';
import ExportPanel from './editor/ExportPanel';
import PaletteManager from './editor/PaletteManager';
import Adjustments from './editor/Adjustments';
import { usePaletteStorage } from '../hooks/usePaletteStorage';

function Editor({ image }) {
  const { t } = useTranslation()
  const initial = {
    pixelSize: 1,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    palette: 'none',
    dither: false,
    zoom: 1,
    showGrid: false,
    exportFormat: 'png',
    quality: 0.92,
    autoPalette: false,
    paletteSize: 16,
    exportScale: 1,
    colorDistance: 'rgb',
    transparentBG: true,
    // UI state managed in reducer
    compact: false,
    imgDim: { w: 0, h: 0 },
    readySrc: null,
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'SET':
        return { ...state, [action.field]: action.value };
      case 'RESET_SLIDERS':
        return { ...state, pixelSize: 1, brightness: 0, contrast: 0, saturation: 0 };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initial);
  const [errorMsg, setErrorMsg] = React.useState('')
  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  const { palettes: customPalettes, upsertPalette, deletePalette } = usePaletteStorage();

  // 限制最大文件大小（MB）
  const MAX_FILE_MB = 10;

  const imageSettings = useMemo(() => ({
    pixelSize: state.pixelSize,
    brightness: state.brightness,
    contrast: state.contrast,
    saturation: state.saturation,
    palette: state.palette,
    dither: state.dither,
    autoPalette: state.autoPalette,
    paletteSize: state.paletteSize,
    colorDistance: state.colorDistance,
  }), [state.pixelSize, state.brightness, state.contrast, state.saturation, state.palette, state.dither, state.autoPalette, state.paletteSize, state.colorDistance]);

  const { processedImage, isProcessing } = useImageProcessor(state.readySrc, imageSettings);

  // Auto-compact based on viewport height
  useEffect(() => {
    const evaluate = () => dispatch({ type: 'SET', field: 'compact', value: window.innerHeight <= 900 });
    evaluate();
    window.addEventListener('resize', evaluate);
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  // 计算缩放以完整放入容器，留出内边距余量
  const fitToScreenDims = useCallback((iw, ih) => {
    const container = previewRef.current;
    if (!container || !iw || !ih) return;
    const cs = getComputedStyle(container);
    const px = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    const py = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    const cw = Math.max(1, (container.clientWidth || 1) - px);
    const ch = Math.max(1, (container.clientHeight || 1) - py);
    const scale = Math.min(cw / iw, ch / ih);
    const clamped = Math.min(8, scale);
    dispatch({ type: 'SET', field: 'zoom', value: clamped });
  }, []);

  // 不再依赖 <img> 的 onload 测量，统一使用解码得到的尺寸 + 容器尺寸自适应

  // 观察容器尺寸变化，保持始终完整展示
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (state.imgDim.w && state.imgDim.h) fitToScreenDims(state.imgDim.w, state.imgDim.h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [state.imgDim.w, state.imgDim.h, fitToScreenDims]);

  // 关键修复：当图片源或处理结果变化时，将预览容器滚动位置归零，避免停留在右下角看起来“空白”
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    el.scrollTop = 0;
  }, [state.readySrc, processedImage]);

  // 监听全局粘贴事件（仅当已进入编辑器时，避免与首页 ToolSection 重复）
  useEffect(() => {
    if (!image) return;
    const onPaste = (e) => {
      const files = Array.from(e.clipboardData?.files || []);
      if (files.length) {
        e.preventDefault();
        handleFiles(files);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  // 等图片解码完成后再开始处理，避免“过早预览/拟合”的闪动
  useEffect(() => {
    dispatch({ type: 'SET', field: 'readySrc', value: null });
    if (!image) return;
    const i = new Image();
    i.decoding = 'async';
    i.src = image;
    const onReady = async () => {
      try { await i.decode(); } catch (e) { if (import.meta?.env?.DEV) console.error('Image decode failed', e); }
      const iw = i.naturalWidth || 1;
      const ih = i.naturalHeight || 1;
      dispatch({ type: 'SET', field: 'imgDim', value: { w: iw, h: ih } });
      fitToScreenDims(iw, ih);
      dispatch({ type: 'SET', field: 'readySrc', value: image });
    };
    if (i.complete) onReady(); else i.onload = onReady;
    return () => { i.onload = null; };
  }, [image, fitToScreenDims]);

  // 统一处理文件列表（PNG/JPG，大小≤10MB）
  const handleFiles = (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    setErrorMsg('')
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      setErrorMsg(t('errors.onlyPngJpg'));
      return;
    }
    const maxBytes = MAX_FILE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMsg(t('errors.maxFile', { mb: MAX_FILE_MB }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result;
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      const onReady = async () => {
        try { await img.decode(); } catch (e) { if (import.meta?.env?.DEV) console.error(e); }
        const iw = img.naturalWidth || 1;
        const ih = img.naturalHeight || 1;
        dispatch({ type: 'SET', field: 'imgDim', value: { w: iw, h: ih } });
        fitToScreenDims(iw, ih);
        dispatch({ type: 'SET', field: 'readySrc', value: src });
      };
      if (img.complete) onReady(); else img.onload = onReady;
    };
    reader.readAsDataURL(file);
  };

  // 拖拽支持：阻止默认并读取文件
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };
  const onDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length) handleFiles(files);
  };

  // 触发上传
  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择：复用 handleFiles
  const onFileSelected = (e) => {
    handleFiles(e.target.files);
    // 重置 input 以便重复选择相同文件
    e.target.value = '';
  };

  const downloadImage = async () => {
    const blob = await exportProcessedBlob(processedImage, {
      format: state.exportFormat,
      scale: state.exportScale,
      quality: state.quality,
      transparentBG: state.transparentBG,
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `pixel-art.${state.exportFormat}`;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  if (!image) return null;

  const layout = state.compact ? LAYOUT_TOKENS.compact : LAYOUT_TOKENS.normal;

  return (
    <section id="editor" className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className={`${COLORS.background} ${layout.padding} rounded-xl border ${COLORS.border}`}>
          <h2 className={`${layout.titleSize} font-bold text-center ${layout.titleMargin}`}>{t('editor.title')}</h2>
          {errorMsg && (
            <p className="mt-2 text-center text-sm text-red-600" role="alert" aria-live="polite">{errorMsg}</p>
          )}
          <div className={`grid grid-cols-1 lg:grid-cols-2 ${layout.gap}`}>
            {/* 预览区域 */}
            <div className="space-y-4">
              <div className={`${layout.height}`} onDragOver={onDragOver} onDrop={onDrop}>
                <Preview
                  previewRef={previewRef}
                  processedImage={processedImage || state.readySrc || ''}
                  zoom={state.zoom}
                  pixelSize={state.pixelSize}
                  showGrid={state.showGrid}
                  isProcessing={isProcessing || !state.readySrc}
                  imgDim={state.imgDim}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={downloadImage}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('editor.downloadBtn')}
                </button>
                <button
                  onClick={triggerUpload}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('editor.uploadBtn')}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={onFileSelected}
                />
              </div>
            </div>

            {/* 控制区域 */}
            <div className={`space-y-4 ${layout.height} overflow-auto`}>
              {/* Section header */}
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center border rounded px-2 py-1 text-sm bg-white">{t('editor.section.general')}</span>
                </div>
                <div className="mt-2 h-[2px] w-full bg-gray-900/80" />
              </div>
              <Adjustments state={state} dispatch={dispatch} customPalettes={customPalettes} />
              <ExportPanel
                exportFormat={state.exportFormat}
                setExportFormat={(e)=>dispatch({type:'SET', field:'exportFormat', value:e.target.value})}
                exportScale={state.exportScale}
                setExportScale={(v)=>dispatch({type:'SET', field:'exportScale', value:v})}
                transparentBG={state.transparentBG}
                setTransparentBG={(v)=>dispatch({type:'SET', field:'transparentBG', value:v})}
                quality={state.quality}
                setQuality={(e)=>dispatch({type:'SET', field:'quality', value:Number(e.target.value)})}
              />
              <PaletteManager onSavePalette={upsertPalette} onDeletePalette={deletePalette} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Editor;
