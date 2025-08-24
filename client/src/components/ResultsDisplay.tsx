import type React from "react"

interface OCRResults {
  name?: string
  aadhaarNumber?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  fatherName?: string
  [key: string]: any
}

interface ResultsDisplayProps {
  results: OCRResults | null
  loading: boolean
  error: string | null
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Processing images...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
          <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return null
  }

  const formatFieldName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  const renderField = (key: string, value: any) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return null
    }

    return (
      <div key={key} className="border-b border-gray-200 py-3 last:border-b-0">
        <dt className="text-sm font-medium text-gray-500">{formatFieldName(key)}</dt>
        <dd className="mt-1 text-sm text-gray-900">{String(value)}</dd>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900">Extracted Information</h2>
      </div>

      <dl className="divide-y divide-gray-200">
        {Object.entries(results).map(([key, value]) => renderField(key, value))}
      </dl>

      {Object.keys(results).length === 0 && (
        <p className="text-gray-500 text-center py-4">No information could be extracted from the images.</p>
      )}
    </div>
  )
}

export default ResultsDisplay
