// src/pages/ReportForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@suiet/wallet-kit";
import { toast } from "react-toastify";
import {
  Upload,
  AlertCircle,
  Info,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Mock submission function - in a real implementation, this would interact with the SUI blockchain
const submitReport = async (reportData) => {
  // Simulate blockchain interaction delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // For demo purposes, always succeed
  return {
    success: true,
    reportId: "report_" + Math.random().toString(36).substring(2, 15),
  };
};

const ReportForm = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stakeAmount, setStakeAmount] = useState(10); // Default stake amount

  // Form state
  const [formData, setFormData] = useState({
    scammerAddress: "",
    scamType: "",
    description: "",
    evidenceFiles: [],
    contactInfo: "",
    additionalDetails: "",
  });

  // Validation state
  const [errors, setErrors] = useState({});

  const scamTypes = [
    { value: "phishing", label: "Phishing Attack" },
    { value: "fake_token", label: "Fake Token" },
    { value: "impersonation", label: "Account Impersonation" },
    { value: "malicious_contract", label: "Malicious Smart Contract" },
    { value: "ponzi", label: "Ponzi/Pyramid Scheme" },
    { value: "rugpull", label: "Rug Pull" },
    { value: "wallet_drain", label: "Wallet Drainer" },
    { value: "other", label: "Other Scam" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      evidenceFiles: [...formData.evidenceFiles, ...files],
    });

    if (errors.evidenceFiles) {
      setErrors({
        ...errors,
        evidenceFiles: "",
      });
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...formData.evidenceFiles];
    updatedFiles.splice(index, 1);
    setFormData({
      ...formData,
      evidenceFiles: updatedFiles,
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.scammerAddress.trim()) {
        newErrors.scammerAddress = "Scammer address is required";
      } else if (!/^0x[a-fA-F0-9]{64}$/.test(formData.scammerAddress)) {
        newErrors.scammerAddress = "Please enter a valid SUI address";
      }

      if (!formData.scamType) {
        newErrors.scamType = "Please select a scam type";
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      } else if (formData.description.length < 30) {
        newErrors.description = "Description must be at least 30 characters";
      }
    }

    if (step === 2) {
      if (formData.evidenceFiles.length === 0) {
        newErrors.evidenceFiles = "At least one piece of evidence is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, you would:
      // 1. Upload evidence files to IPFS or other storage
      // 2. Call the SUI contract to submit the report with evidence hashes
      // 3. Handle staking the required amount

      const result = await submitReport({
        ...formData,
        reporterAddress: account.address,
        stakeAmount,
        timestamp: new Date().toISOString(),
        evidenceHashes: formData.evidenceFiles.map(
          () => `0x${Math.random().toString(16).substring(2, 66)}`
        ),
      });

      if (result.success) {
        toast.success("Report submitted successfully!");
        navigate(`/reports/${result.reportId}`);
      } else {
        toast.error("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Report a Scam
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Help protect the SUI community by reporting scam activities
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              1
            </div>
            <span className="text-sm mt-2">Scam Details</span>
          </div>

          <div className="flex-1 h-1 mx-4 bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full ${
                currentStep >= 2
                  ? "bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              style={{ width: currentStep >= 2 ? "100%" : "0%" }}
            ></div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              2
            </div>
            <span className="text-sm mt-2">Evidence</span>
          </div>

          <div className="flex-1 h-1 mx-4 bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full ${
                currentStep >= 3
                  ? "bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              style={{ width: currentStep >= 3 ? "100%" : "0%" }}
            ></div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              3
            </div>
            <span className="text-sm mt-2">Confirmation</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="scammerAddress"
              >
                Scammer's Wallet Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="scammerAddress"
                name="scammerAddress"
                value={formData.scammerAddress}
                onChange={handleInputChange}
                placeholder="0x..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.scammerAddress
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.scammerAddress && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.scammerAddress}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="scamType"
              >
                Scam Type <span className="text-red-500">*</span>
              </label>
              <select
                id="scamType"
                name="scamType"
                value={formData.scamType}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.scamType
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select a scam type</option>
                {scamTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.scamType && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.scamType}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="description"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe how the scam works and how you discovered it..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.description
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="contactInfo"
              >
                Scammer's Contact Information (Optional)
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="Email, social media handles, website, etc."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                This helps others identify the scammer across platforms
              </p>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors flex items-center"
              >
                Next Step
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Upload Evidence <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  errors.evidenceFiles
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Drag and drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Supported formats: PNG, JPG, PDF, TXT (Max 10MB per file)
                  </p>
                  <input
                    type="file"
                    id="evidenceFiles"
                    name="evidenceFiles"
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                  />
                  <label
                    htmlFor="evidenceFiles"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors cursor-pointer"
                  >
                    Select Files
                  </label>
                </div>
              </div>
              {errors.evidenceFiles && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.evidenceFiles}
                </p>
              )}

              {formData.evidenceFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Uploaded Files ({formData.evidenceFiles.length})
                  </h4>
                  <ul className="space-y-2">
                    {formData.evidenceFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2"
                      >
                        <div className="flex items-center">
                          <span className="truncate max-w-md">{file.name}</span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="additionalDetails"
              >
                Additional Evidence Details (Optional)
              </label>
              <textarea
                id="additionalDetails"
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                rows="3"
                placeholder="Explain what each piece of evidence shows or any additional context..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg shadow-md transition-colors flex items-center"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors flex items-center"
              >
                Next Step
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-blue-800 dark:text-blue-300 font-medium">
                    Stake Requirement
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    To prevent spam and false reports, you need to stake SUI
                    tokens when submitting a report. Your stake will be returned
                    if your report is verified to be accurate.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="stakeAmount"
              >
                Stake Amount (SUI)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="stakeAmount"
                  min="10"
                  max="100"
                  step="10"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(parseInt(e.target.value))}
                  className="w-full mr-4"
                />
                <span className="text-gray-900 dark:text-white font-bold text-xl min-w-[60px]">
                  {stakeAmount} SUI
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Higher stakes increase your report's visibility and priority for
                verification.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Report Summary
              </h3>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Scammer Address
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono break-all">
                    {formData.scammerAddress}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Scam Type
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {scamTypes.find((type) => type.value === formData.scamType)
                      ?.label || formData.scamType}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Description
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formData.description}
                  </span>
                </div>

                {formData.contactInfo && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Scammer's Contact Info
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formData.contactInfo}
                    </span>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Evidence Files
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formData.evidenceFiles.length} files uploaded
                  </span>
                </div>

                {formData.additionalDetails && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Additional Evidence Details
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formData.additionalDetails}
                    </span>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Reporter Address
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono break-all">
                    {account.address}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Stake Amount
                  </span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    {stakeAmount} SUI
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg shadow-md transition-colors flex items-center"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Report
                    <Check className="ml-1 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReportForm;
