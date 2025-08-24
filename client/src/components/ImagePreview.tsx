import type React from "react"

import { useState, useEffect } from "react"

interface ImagePreviewProps {
  image: File
  title: string
  onRemove: () => void
  showRemove?: boolean
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, title, onRemove, showRemove = true }) => {
  const [imageUrl, setImageUrl] = useState<string>("")

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image)
      setImageUrl(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [image])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Image */}
      <div className="relative aspect-video bg-gray-100">
        {imageUrl && <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />}

        {/* Remove button */}
        {showRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
            title="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Image info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            <span className="font-medium">File:</span> {image.name}
          </p>
          <p>
            <span className="font-medium">Size:</span> {formatFileSize(image.size)}
          </p>
          <p>
            <span className="font-medium">Type:</span> {image.type}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImagePreview
