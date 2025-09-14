// Image processing utilities for pixel art conversion
export function pixelateImage(imageData, pixelSize) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const img = new Image()
      img.onload = function() {
        const width = img.width
        const height = img.height
        
        canvas.width = width
        canvas.height = height
        
        // Disable image smoothing for pixel art effect
        ctx.imageSmoothingEnabled = false
        ctx.webkitImageSmoothingEnabled = false
        ctx.mozImageSmoothingEnabled = false
        
        // Draw the image scaled down then back up to create pixel effect
        const scaledWidth = Math.floor(width / pixelSize)
        const scaledHeight = Math.floor(height / pixelSize)
        
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight)
        ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height)
        
        resolve(canvas.toDataURL())
      }
      
      img.onerror = function(error) {
        reject(error)
      }
      
      img.src = imageData
    } catch (error) {
      console.error('Image processing error:', error)
      reject(error)
    }
  })
}

export function applyImageFilters(imageData, brightness, contrast, saturation) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const img = new Image()
      img.onload = function() {
        canvas.width = img.width
        canvas.height = img.height
        
        // Apply CSS filters
        ctx.filter = `brightness(${100 + parseInt(brightness)}%) contrast(${100 + parseInt(contrast)}%) saturate(${100 + parseInt(saturation)}%)`
        ctx.drawImage(img, 0, 0)
        
        resolve(canvas.toDataURL())
      }
      
      img.onerror = function(error) {
        reject(error)
      }
      
      img.src = imageData
    } catch (error) {
      console.error('Filter application error:', error)
      reject(error)
    }
  })
}

// 调色板颜色映射函数
export async function applyPalette(imageData, palette) {
  if (!palette || palette === 'none') {
    return imageData
  }
  
  return new Promise((resolve, reject) => {
    try {
      const paletteColors = {
        'Pico-8': ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'],
        'Lost Century': ['#2b2821', '#624c24', '#95743a', '#be9862', '#dcc58f', '#f3eac6', '#aad35b', '#6b9c35', '#407014', '#1e360a', '#193532', '#3a484a', '#5c7b85', '#89b8b3', '#c1e2dd', '#eafffd'],
        'Sunset 8': ['#04080f', '#302c2e', '#f22e2e', '#f9a031', '#ffe883', '#a6e163', '#4fccf9', '#1a0d50'],
        'Twilight 5': ['#fbbbad', '#ee8695', '#4a7a96', '#333f58', '#292831'],
        'Hollow': ['#0f0f1b', '#565a75', '#c6b7be', '#fafbf6', '#2d2d2d']
      }
      
      const selectedPalette = paletteColors[palette]
      if (!selectedPalette) {
        resolve(imageData) // 如果没有找到调色板，直接返回原图
        return
      }
      
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      const img = new Image()
      img.onload = function() {
        canvas.width = img.width
        canvas.height = img.height
        
        ctx.drawImage(img, 0, 0)
        
        // 获取像素数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // 对每个像素应用调色板颜色
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          // 找出与当前颜色最接近的调色板颜色
          let minDistance = Number.MAX_VALUE
          let closestColor = null
          
          for (const hexColor of selectedPalette) {
            // 将十六进制颜色转换为RGB
            const r2 = parseInt(hexColor.slice(1, 3), 16)
            const g2 = parseInt(hexColor.slice(3, 5), 16)
            const b2 = parseInt(hexColor.slice(5, 7), 16)
            
            // 计算颜色距离
            const distance = Math.sqrt(
              Math.pow(r - r2, 2) + 
              Math.pow(g - g2, 2) + 
              Math.pow(b - b2, 2)
            )
            
            if (distance < minDistance) {
              minDistance = distance
              closestColor = { r: r2, g: g2, b: b2 }
            }
          }
          
          // 应用最接近的调色板颜色
          data[i] = closestColor.r
          data[i + 1] = closestColor.g
          data[i + 2] = closestColor.b
          // alpha通道保持不变
        }
        
        // 将处理后的像素数据放回canvas
        ctx.putImageData(imageData, 0, 0)
        resolve(canvas.toDataURL())
      }
      
      img.onerror = function(error) {
        reject(error)
      }
      
      img.src = imageData
    } catch (error) {
      console.error('Palette application error:', error)
      reject(error)
    }
  })
}

// 处理图片的主函数，按顺序应用所有效果
export async function processImage(imageData, { pixelSize, brightness, contrast, saturation, palette }) {
  try {
    // 第一步：应用像素化
    let result = await pixelateImage(imageData, pixelSize)
    
    // 第二步：应用亮度、对比度和饱和度滤镜
    result = await applyImageFilters(result, brightness, contrast, saturation)
    
    // 第三步：应用调色板（如果选择了）
    if (palette && palette !== 'none') {
      result = await applyPalette(result, palette)
    }
    
    return result
  } catch (error) {
    console.error('Error processing image:', error)
    return imageData // 出错时返回原图
  }
}