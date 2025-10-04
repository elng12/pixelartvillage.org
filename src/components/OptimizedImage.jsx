import React, { useState, useRef, useEffect } from 'react'

// 优化的图片组件，支持懒加载和多种优化策略
export default function OptimizedImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  width,
  height,
  priority = false,
  placeholder = 'blur',
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)

  // 交集观察器实现懒加载
  useEffect(() => {
    if (priority || !imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.01
      }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [priority])

  // 图片加载完成处理
  const handleLoad = () => {
    setIsLoaded(true)
  }

  // 图片加载错误处理
  const handleError = () => {
    setHasError(true)
  }

  // 生成模糊占位符
  const getPlaceholderStyle = () => {
    if (placeholder !== 'blur' || !isInView) return {}

    return {
      filter: isLoaded ? 'none' : 'blur(20px)',
      transition: 'filter 0.3s ease-in-out',
      transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
      transition: 'transform 0.3s ease-in-out'
    }
  }

  // 错误回退
  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: width || '100%', height: height || '200px' }}
        role="img"
        aria-label={alt || 'Image failed to load'}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : loading}
          sizes={sizes}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          style={getPlaceholderStyle()}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}

      {/* 加载占位符 */}
      {!isLoaded && isInView && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
    </div>
  )
}

// 预加载关键图片的Hook
export function usePreloadImages(srcs, priority = false) {
  useEffect(() => {
    if (!srcs || srcs.length === 0) return

    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = src
      })
    }

    const preloadImages = async () => {
      try {
        if (priority) {
          // 高优先级：立即预加载
          await Promise.all(srcs.map(preloadImage))
        } else {
          // 低优先级：在空闲时间预加载
          if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
              for (const src of srcs) {
                await preloadImage(src)
              }
            })
          } else {
            setTimeout(async () => {
              for (const src of srcs) {
                await preloadImage(src)
              }
            }, 2000)
          }
        }
      } catch (error) {
        console.warn('Failed to preload images:', error)
      }
    }

    preloadImages()
  }, [srcs, priority])
}