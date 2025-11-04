import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

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
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  const getPlaceholderStyle = () => {
    if (placeholder !== 'blur' || !isInView) return {}

    return {
      filter: isLoaded ? 'none' : 'blur(20px)',
      transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
      transition: 'filter 0.3s ease-in-out, transform 0.3s ease-in-out'
    }
  }

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
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      )}

      {!isLoaded && isInView && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
    </div>
  )
}

