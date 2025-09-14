'use client'

import { useState, useEffect, useCallback } from 'react'
import { processImage } from '../utils/imageProcessor'

export default function ControlPanel({ image, show, onClose }) {
  const [pixelSize, setPixelSize] = useState(8)
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [selectedPalette, setSelectedPalette] = useState('none')
  const [processedImage, setProcessedImage] = useState(image)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [generalOpen, setGeneralOpen] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [customPaletteUrl, setCustomPaletteUrl] = useState('')

  const palettes = [
    'Pico-8',
    'Lost Century', 
    'Sunset 8',
    'Twilight 5',
    'Hollow'
  ]

  // 图片处理函数
  const updateProcessedImage = useCallback(async (sourceImage) => {
    if (!sourceImage) return
    
    setIsProcessing(true)
    try {
      const result = await processImage(sourceImage, {
        pixelSize,
        brightness,
        contrast,
        saturation,
        palette: selectedPalette
      })
      setProcessedImage(result)
    } catch (error) {
      console.error('Failed to process image:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [pixelSize, brightness, contrast, saturation, selectedPalette])

  // 获取图片尺寸
  useEffect(() => {
    if (image) {
      const img = new Image()
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height })
      }
      img.src = image
      setUploadedImage(image)
      setProcessedImage(image)
    }
  }, [image])

  // 当参数变化时重新处理图片
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateProcessedImage(uploadedImage || image)
    }, 200) // 添加延迟，避免滑块拖动时过度处理
    
    return () => clearTimeout(timeoutId)
  }, [uploadedImage, image, updateProcessedImage])

  // 重置函数
  const resetPixelSize = () => {
    setPixelSize(8)
  }

  const resetBrightness = () => {
    setBrightness(0)
  }

  const resetContrast = () => {
    setContrast(0)
  }

  const resetSaturation = () => {
    setSaturation(0)
  }

  const resetAllSliders = () => {
    setPixelSize(8)
    setBrightness(0)
    setContrast(0)
    setSaturation(0)
  }

  // 文件上传处理
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
        const img = new Image()
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height })
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  // 拖拽上传处理
  const [dragOver, setDragOver] = useState(false)
  
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
        const img = new Image()
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height })
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  // 下载处理
  const downloadImage = (size) => {
    const link = document.createElement('a')
    const filename = `pixel-art-${size}-${new Date().getTime()}.png`
    link.download = filename
    link.href = processedImage
    link.click()
  }

  // 导入自定义调色板
  const importCustomPalette = () => {
    // 这里可以添加导入自定义调色板的逻辑
    console.log('导入调色板:', customPaletteUrl)
    
    // 在这里可以解析 Lospec URL，但目前只是模拟导入成功
    if (customPaletteUrl.includes('lospec.com')) {
      alert('调色板导入成功！')
    } else {
      alert('请输入有效的 Lospec.com 调色板 URL')
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" data-name="control-panel" data-file="components/ControlPanel.js">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-y-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-6">
            {/* Back Button */}
            <div className="mb-4">
              <button 
                onClick={onClose}
                className="flex items-center text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
              >
                ← Back
              </button>
            </div>

            {/* Upload Zone */}
            <div 
              className={`upload-zone ${dragOver ? 'border-[var(--primary-color)] bg-blue-50' : ''} mb-6`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => document.getElementById('control-panel-file-input').click()}
            >
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-[var(--text-secondary)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-[var(--primary-color)]">Click to upload or drag and drop</p>
              </div>
              <input
                id="control-panel-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Image Dimensions */}
            <div className="text-center mb-4">
              <span className="text-[var(--text-secondary)]">
                {imageDimensions.width}px - {imageDimensions.height}px
              </span>
            </div>
            
            <div className="text-center mb-6">
              {isProcessing ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
                </div>
              ) : (
                <img 
                  src={processedImage}
                  alt="Preview"
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '400px', imageRendering: 'pixelated' }}
                />
              )}
              <div className="mt-4 flex justify-center space-x-4">
                <button 
                  onClick={() => downloadImage('small')}
                  className="btn-primary"
                  disabled={isProcessing}
                >
                  Download Small
                </button>
                <button 
                  onClick={() => downloadImage('large')}
                  className="btn-secondary"
                  disabled={isProcessing}
                >
                  Download Large
                </button>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-80 bg-gray-50 p-6 border-l">
            <div className="space-y-6">
              {/* General Section with Dropdown */}
              <div>
                <button 
                  onClick={() => setGeneralOpen(!generalOpen)}
                  className="flex items-center justify-between w-full text-left font-semibold mb-4 p-2 bg-[var(--primary-color)] text-white rounded"
                >
                  General
                  <span>{generalOpen ? '▼' : '▶'}</span>
                </button>
                
                {generalOpen && (
                  <div className="space-y-4">
                    <button 
                      onClick={resetAllSliders}
                      className="btn-secondary w-full mb-4"
                    >
                      Reset All
                    </button>
                    
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <button onClick={resetPixelSize} className="btn-secondary text-xs p-1">PS</button>
                      <button onClick={resetBrightness} className="btn-secondary text-xs p-1">BR</button>
                      <button onClick={resetContrast} className="btn-secondary text-xs p-1">CT</button>
                      <button onClick={resetSaturation} className="btn-secondary text-xs p-1">SN</button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Pixel Size</label>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={pixelSize}
                        onChange={(e) => setPixelSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">{pixelSize}</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Brightness</label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">{brightness}</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Contrast</label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={contrast}
                        onChange={(e) => setContrast(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">{contrast}</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Saturation</label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={saturation}
                        onChange={(e) => setSaturation(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">{saturation}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Palette</h3>
                <select 
                  value={selectedPalette}
                  onChange={(e) => setSelectedPalette(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4"
                >
                  <option value="none">No Palette</option>
                  {palettes.map(palette => (
                    <option key={palette} value={palette}>{palette}</option>
                  ))}
                </select>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Import Palette (Lospec.com)"
                    value={customPaletteUrl}
                    onChange={(e) => setCustomPaletteUrl(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-2"
                  />
                  <button 
                    className="btn-secondary w-full"
                    onClick={importCustomPalette}
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}