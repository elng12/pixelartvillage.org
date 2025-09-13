'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';

interface ImageSettings {
  pixelSize: number;
  brightness: number;
  contrast: number;
  saturation: number;
}

export default function Converter() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<ImageSettings>({
    pixelSize: 8,
    brightness: 0,
    contrast: 0,
    saturation: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement>(null);

  // 像素化处理函数
  const pixelateImage = useCallback((image: HTMLImageElement, pixelSize: number, brightness: number, contrast: number, saturation: number) => {
    const canvas = pixelCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    canvas.width = image.width;
    canvas.height = image.height;

    // 创建临时画布进行像素化
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // 计算缩小后的尺寸
    const smallWidth = Math.max(1, Math.floor(image.width / pixelSize));
    const smallHeight = Math.max(1, Math.floor(image.height / pixelSize));

    tempCanvas.width = smallWidth;
    tempCanvas.height = smallHeight;

    // 关闭图像平滑
    tempCtx.imageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // 绘制缩小的图像
    tempCtx.drawImage(image, 0, 0, smallWidth, smallHeight);

    // 将缩小的图像放大回原尺寸
    ctx.drawImage(tempCanvas, 0, 0, smallWidth, smallHeight, 0, 0, image.width, image.height);

    // 应用滤镜效果
    if (brightness !== 0 || contrast !== 0 || saturation !== 0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // 应用亮度
        if (brightness !== 0) {
          r = Math.max(0, Math.min(255, r + brightness));
          g = Math.max(0, Math.min(255, g + brightness));
          b = Math.max(0, Math.min(255, b + brightness));
        }

        // 应用对比度
        if (contrast !== 0) {
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          r = Math.max(0, Math.min(255, factor * (r - 128) + 128));
          g = Math.max(0, Math.min(255, factor * (g - 128) + 128));
          b = Math.max(0, Math.min(255, factor * (b - 128) + 128));
        }

        // 应用饱和度
        if (saturation !== 0) {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          const satFactor = saturation / 100;
          r = Math.max(0, Math.min(255, gray + satFactor * (r - gray)));
          g = Math.max(0, Math.min(255, gray + satFactor * (g - gray)));
          b = Math.max(0, Math.min(255, gray + satFactor * (b - gray)));
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }

      ctx.putImageData(imageData, 0, 0);
    }
  }, []);

  // 处理图像上传
  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        
        // 绘制原图到原图画布
        const originalCanvas = originalCanvasRef.current;
        if (originalCanvas) {
          const ctx = originalCanvas.getContext('2d');
          if (ctx) {
            originalCanvas.width = img.width;
            originalCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // 处理拖拽
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  // 重置所有参数
  const resetAll = () => {
    setSettings({
      pixelSize: 8,
      brightness: 0,
      contrast: 0,
      saturation: 0
    });
  };

  // 预设参数
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'PS':
        setSettings({ pixelSize: 4, brightness: 10, contrast: 20, saturation: 10 });
        break;
      case 'BR':
        setSettings({ pixelSize: 12, brightness: -10, contrast: 30, saturation: -20 });
        break;
      case 'CT':
        setSettings({ pixelSize: 6, brightness: 0, contrast: 40, saturation: 0 });
        break;
      case 'SN':
        setSettings({ pixelSize: 10, brightness: 5, contrast: 10, saturation: 50 });
        break;
    }
  };

  // 下载图像
  const downloadImage = () => {
    const canvas = pixelCanvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // 当设置改变时重新处理图像
  useEffect(() => {
    if (originalImage) {
      pixelateImage(originalImage, settings.pixelSize, settings.brightness, settings.contrast, settings.saturation);
    }
  }, [originalImage, settings, pixelateImage]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Upload Area */}
        {!originalImage && (
          <div className="mb-8">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400 mb-4">PNG, JPG, GIF up to 10MB</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Main Interface */}
        {originalImage && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Reset Sliders</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={resetAll}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={() => applyPreset('PS')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  PS
                </button>
                <button
                  onClick={() => applyPreset('BR')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  BR
                </button>
                <button
                  onClick={() => applyPreset('CT')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  CT
                </button>
                <button
                  onClick={() => applyPreset('SN')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  SN
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pixel Size: {settings.pixelSize}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={settings.pixelSize}
                    onChange={(e) => setSettings(prev => ({ ...prev, pixelSize: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brightness: {settings.brightness}
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={settings.brightness}
                    onChange={(e) => setSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contrast: {settings.contrast}
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={settings.contrast}
                    onChange={(e) => setSettings(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saturation: {settings.saturation}
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={settings.saturation}
                    onChange={(e) => setSettings(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Image Preview */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                {originalImage.width}px × {originalImage.height}px
              </p>
              
              <div className="inline-block border rounded-lg overflow-hidden bg-white shadow-lg">
                <canvas
                  ref={originalCanvasRef}
                  className="hidden"
                />
                <canvas
                  ref={pixelCanvasRef}
                  className="max-w-full h-auto"
                  style={{ maxHeight: '500px' }}
                />
              </div>

              <div className="mt-6 space-x-4">
                <button
                  onClick={downloadImage}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => {
                    setOriginalImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Upload New Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}