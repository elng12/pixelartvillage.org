import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// 浼樺寲鐨勫浘鐗囩粍浠讹紝鏀寔鎳掑姞杞藉拰澶氱浼樺寲绛栫暐
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
  const { t } = useTranslation()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)

  // 浜ら泦瑙傚療鍣ㄥ疄鐜版噿鍔犺浇
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
        rootMargin: '50px 0px', // 鎻愬墠50px寮€濮嬪姞杞?
        threshold: 0.01
      }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [priority])

  // 鍥剧墖鍔犺浇瀹屾垚澶勭悊
  const handleLoad = () => {
    setIsLoaded(true)
  }

  // 鍥剧墖鍔犺浇閿欒澶勭悊
  const handleError = () => {
    setHasError(true)
  }

  // 鐢熸垚妯＄硦鍗犱綅绗?
  const getPlaceholderStyle = () => {
    if (placeholder !== 'blur' || !isInView) return {}

    return {
      filter: isLoaded ? 'none' : 'blur(20px)',
      transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
      transition: 'filter 0.3s ease-in-out, transform 0.3s ease-in-out'
    }
  }

  // 閿欒鍥為€€
  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: width || '100%', height: height || '200px' }}
        role="img"
        aria-label={alt || t('common.imageFailedToLoad', 'Image failed to load')}
      >
        <span className="text-gray-500 text-sm">{t('common.imageUnavailable', 'Image unavailable')}</span>
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

      {/* 鍔犺浇鍗犱綅绗?*/}
      {!isLoaded && isInView && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
    </div>
  )
}

// 棰勫姞杞藉叧閿浘鐗囩殑Hook
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
          // 楂樹紭鍏堢骇锛氱珛鍗抽鍔犺浇
          await Promise.all(srcs.map(preloadImage))
        } else {
          // 浣庝紭鍏堢骇锛氬湪绌洪棽鏃堕棿棰勫姞杞?
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

