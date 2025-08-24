import type React from "react"

import { useRef, useState } from "react"

interface ImageUploadProps {
  label: string
  onImageUpload: (file: File) => void
  disabled?: boolean
  accept?: string
  maxSize?: number
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  onImageUpload,
  disabled = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return false
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`)
      return false
    }

    setError(null)
    return true
  }

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onImageUpload(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setDragActive(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:border-gray-400"}
          ${error ? "border-red-300 bg-red-50" : ""}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span>
            <span> or drag and drop</span>
          </div>

          <p className="text-xs text-gray-500">PNG, JPG, GIF up to {Math.round(maxSize / (1024 * 1024))}MB</p>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default ImageUpload
