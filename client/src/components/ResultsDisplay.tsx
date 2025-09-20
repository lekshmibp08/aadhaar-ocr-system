import type React from "react";
import { HiCheckCircle } from "react-icons/hi";
import { HiXCircle } from "react-icons/hi";
import { useState } from "react";
import OCRButton from "./OCRButton";

interface OCRResults {
  name?: string;
  aadhaarNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  fatherName?: string;
  [key: string]: any;
}

interface ResultsDisplayProps {
  results: OCRResults | null;
  loading: boolean;
  error: string | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  loading,
  error,
}) => {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Processing images...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
          <HiXCircle className="w-5 h-5 text-red-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const formatFieldName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

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

  const validEntries = Object.entries(results).filter(
    ([, value]) => value && String(value).trim() !== ""
  );
  const hasValidFields = validEntries.length > 0;

  const handleCopy = async () => {
    if (!hasValidFields) return;

    const textToCopy = validEntries
      .map(([key, value]) => `${formatFieldName(key)}: ${value}`)
      .join("\n");

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <HiCheckCircle className="w-5 h-5 text-green-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">
          Extracted Information
        </h2>
      </div>

      <OCRButton
        onClick={handleCopy}
        variant="success"
        className="px-3 py-2 text-sm"
        disabled={!hasValidFields}
      >
        {copied ? "Copied!" : "Copy"}
      </OCRButton>

      <dl className="divide-y divide-gray-200">
        {validEntries.map(([key, value]) => renderField(key, value))}
      </dl>

      {!hasValidFields && (
        <p className="text-gray-500 text-center py-4">
          No information could be extracted from the images.
        </p>
      )}
    </div>
  );
};

export default ResultsDisplay;
