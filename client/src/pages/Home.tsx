import { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import ImagePreview from "../components/ImagePreview";
import OCRButton from "../components/OCRButton";
import ResultsDisplay from "../components/ResultsDisplay";
import { processAndFetchData } from "../service/api";

interface OCRResults {
  name?: string;
  aadhaarNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  fatherName?: string;
  [key: string]: any;
}

const AadhaarOCRApp = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [ocrResults, setOcrResults] = useState<OCRResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFrontImageUpload = (file: File) => {
    setFrontImage(file);
    setError(null);
  };

  const handleBackImageUpload = (file: File) => {
    setBackImage(file);
    setError(null);
  };

  const handleRemoveFrontImage = () => {
    setFrontImage(null);
  };

  const handleRemoveBackImage = () => {
    setBackImage(null);
  };

  const handleOCRProcess = async () => {
    if (!frontImage || !backImage) {
      setError("Please upload both front and back images of the Aadhaar card");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("frontImage", frontImage);
      formData.append("backImage", backImage);

      const response = await processAndFetchData(formData);
      setOcrResults(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing the images"
      );
    } finally {
      setLoading(false);
    }
  };

  const canProcessOCR = frontImage && backImage && !loading;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Aadhaar OCR System
          </h1>
          <p className="text-gray-600">
            Upload front and back images of your Aadhaar card to extract
            information
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upload Aadhaar Card Images
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <ImageUpload
              label="Front Side of Aadhaar Card"
              onImageUpload={handleFrontImageUpload}
              disabled={loading}
            />

            <ImageUpload
              label="Back Side of Aadhaar Card"
              onImageUpload={handleBackImageUpload}
              disabled={loading}
            />
          </div>
        </div>

        {/* Image Previews */}
        {(frontImage || backImage) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Uploaded Images
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {frontImage && (
                <ImagePreview
                  image={frontImage}
                  title="Front Side"
                  onRemove={handleRemoveFrontImage}
                  showRemove={!loading}
                />
              )}

              {backImage && (
                <ImagePreview
                  image={backImage}
                  title="Back Side"
                  onRemove={handleRemoveBackImage}
                  showRemove={!loading}
                />
              )}
            </div>
          </div>
        )}

        {/* OCR Button */}
        <div className="text-center mb-6">
          <OCRButton
            onClick={handleOCRProcess}
            loading={loading}
            disabled={!canProcessOCR}
            className="w-full sm:w-auto"
          >
            {loading ? "Processing..." : "Extract Information"}
          </OCRButton>
        </div>

        {/* Results */}
        <ResultsDisplay results={ocrResults} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default AadhaarOCRApp;
