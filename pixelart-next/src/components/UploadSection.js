'use client'

import { useState } from 'react'

export default function UploadSection({ onImageUpload, onShowControls }) {
  const [dragOver, setDragOver] = useState(false)
  
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleImageUpload(files[0])
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleImageUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      onImageUpload(e.target.result)
      onShowControls()
    }
    reader.readAsDataURL(file)
  }

  const handleExampleClick = (exampleName) => {
    const examples = {
      sunrise: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      cobblestone: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      fuji: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=400&h=300&fit=crop'
    }
    onImageUpload(examples[exampleName])
    onShowControls()
  }

  return (
    <section className="py-16 bg-[var(--bg-dark)]" data-name="upload-section" data-file="components/UploadSection.js">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-lg text-[var(--text-secondary)]">
            Upload Image (Or Try An Example: 
            <button onClick={() => handleExampleClick('sunrise')} className="text-[var(--primary-color)] hover:underline mx-1">Sunrise</button>,
            <button onClick={() => handleExampleClick('cobblestone')} className="text-[var(--primary-color)] hover:underline mx-1">Cobblestone</button>,
            <button onClick={() => handleExampleClick('fuji')} className="text-[var(--primary-color)] hover:underline mx-1">Mt. Fuji</button>)
          </p>
        </div>
        
        <div 
          className={`upload-zone ${dragOver ? 'border-[var(--primary-color)] bg-blue-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => document.getElementById('file-input').click()}
        >
          <div className="text-center">
            {/* 使用SVG替代图标类 */}
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-[var(--text-secondary)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg text-[var(--text-secondary)] mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Supports PNG, JPG, SVG files
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>
    </section>
  )
}