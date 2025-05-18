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
import axiosClient from "../utils/apiClient";

const ReportForm = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stakeAmount, setStakeAmount] = useState(10); // Default stake amount

  // Form state - matching backend fields
  const [formData, setFormData] = useState({
    title: "",
    scammer_address: "",
    scam_type: "",
    description: "",
    evidence_files: [],
    contact_info: "",
    additional_details: "",
    transaction_hash: "", // Optional, for blockchain integration
    sui_object_id: "", // Will be set after blockchain interaction
    stake_amount: 10,
    transaction_amount: null,
  });

  // Validation state
  const [errors, setErrors] = useState({});

  const scamTypes = [
    { value: "website", label: "Malicious Website" },
    { value: "wallet", label: "Wallet Drainer" },
    { value: "social_media", label: "Social Media Scam" },
    { value: "smart_contract", label: "Malicious Smart Contract" },
    { value: "airdrop", label: "Fake Airdrop" },
    { value: "impersonation", label: "Account Impersonation" },
    { value: "phishing", label: "Phishing Attack" },
    { value: "fake_token", label: "Fake Token" },
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
      evidence_files: [...formData.evidence_files, ...files],
    });

    if (errors.evidence_files) {
      setErrors({
        ...errors,
        evidence_files: "",
      });
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...formData.evidence_files];
    updatedFiles.splice(index, 1);
    setFormData({
      ...formData,
      evidence_files: updatedFiles,
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Report title is required";
      }

      if (!formData.scammer_address.trim()) {
        newErrors.scammer_address = "Scammer address is required";
      } else if (!/^0x[a-fA-F0-9]{64}$/.test(formData.scammer_address)) {
        newErrors.scammer_address = "Please enter a valid SUI address";
      }

      if (!formData.scam_type) {
        newErrors.scam_type = "Please select a scam type";
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      } else if (formData.description.length < 30) {
        newErrors.description = "Description must be at least 30 characters";
      }
    }

    if (step === 2) {
      if (formData.evidence_files.length === 0) {
        newErrors.evidence_files = "At least one piece of evidence is required";
      }

      // Validate file sizes (max 10MB per file)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      for (const file of formData.evidence_files) {
        if (file.size > maxSize) {
          newErrors.evidence_files = `File "${file.name}" is too large. Maximum size is 10MB.`;
          break;
        }
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

    if (!account?.address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare FormData for multipart upload
      const submitData = new FormData();

      // Add text fields
      submitData.append("title", formData.title);
      submitData.append("scammer_address", formData.scammer_address);
      submitData.append("scam_type", formData.scam_type);
      submitData.append("description", formData.description);
      submitData.append("stake_amount", stakeAmount);
      submitData.append("transaction_amount", formData.transaction_amount);

      // Add optional fields if they exist
      if (formData.contact_info.trim()) {
        submitData.append("contact_info", formData.contact_info);
      }

      if (formData.additional_details.trim()) {
        submitData.append("additional_details", formData.additional_details);
      }

      if (formData.transaction_hash.trim()) {
        submitData.append("transaction_hash", formData.transaction_hash);
      }

      if (formData.sui_object_id.trim()) {
        submitData.append("sui_object_id", formData.sui_object_id);
      }

      // Add evidence files
      formData.evidence_files.forEach((file, index) => {
        submitData.append("evidence_files", file);
      });

      // TODO: In a real implementation, you would:
      // 1. First interact with the SUI blockchain to stake tokens
      // 2. Get the transaction hash and SUI object ID from the blockchain
      // 3. Then submit to the backend with these values

      // For now, we'll submit without blockchain interaction
      const response = await axiosClient.post("/reports/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Report submitted successfully!");
        navigate(`/reports/${response.data.id}`);
      } else {
        toast.error("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);

      if (error.response?.data) {
        // Handle validation errors from backend
        const backendErrors = error.response.data;
        if (typeof backendErrors === "object") {
          const errorMessages = Object.entries(backendErrors)
            .map(
              ([field, messages]) =>
                `${field}: ${
                  Array.isArray(messages) ? messages.join(", ") : messages
                }`
            )
            .join("\n");
          toast.error(`Validation errors:\n${errorMessages}`);
        } else {
          toast.error(backendErrors.detail || "Failed to submit report");
        }
      } else {
        toast.error("An error occurred. Please try again later.");
      }
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
                htmlFor="title"
              >
                Report Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief title describing the scam"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.title
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="scammer_address"
              >
                Scammer's Wallet Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="scammer_address"
                name="scammer_address"
                value={formData.scammer_address}
                onChange={handleInputChange}
                placeholder="0x..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.scammer_address
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.scammer_address && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.scammer_address}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="scam_type"
              >
                Scam Type <span className="text-red-500">*</span>
              </label>
              <select
                id="scam_type"
                name="scam_type"
                value={formData.scam_type}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.scam_type
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
              {errors.scam_type && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.scam_type}
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
                htmlFor="contact_info"
              >
                Scammer's Contact Information (Optional)
              </label>
              <input
                type="text"
                id="contact_info"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleInputChange}
                placeholder="Email, social media handles, website, etc."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                This helps others identify the scammer across platforms
              </p>
            </div>

            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="transaction_hash"
              >
                Related Transaction Hash (Optional)
              </label>
              <input
                type="text"
                id="transaction_hash"
                name="transaction_hash"
                value={formData.transaction_hash}
                onChange={handleInputChange}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Transaction hash related to the scam (if applicable)
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
                  errors.evidence_files
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
                    accept=".png,.jpg,.jpeg,.pdf,.txt,.doc,.docx"
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
              {errors.evidence_files && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.evidence_files}
                </p>
              )}

              {formData.evidence_files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Uploaded Files ({formData.evidence_files.length})
                  </h4>
                  <ul className="space-y-2">
                    {formData.evidence_files.map((file, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2"
                      >
                        <div className="flex items-center">
                          <span className="truncate max-w-md">{file.name}</span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
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
                htmlFor="additional_details"
              >
                Additional Evidence Details (Optional)
              </label>
              <textarea
                id="additional_details"
                name="additional_details"
                value={formData.additional_details}
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
                htmlFor="stakeAmountRange"
              >
                Stake Amount (SUI)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="stakeAmountRange"
                  min="10"
                  max="100"
                  step="10"
                  value={stakeAmount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setStakeAmount(value);
                    setFormData({
                      ...formData,
                      stake_amount: value,
                    });
                  }}
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
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="stakeAmountRange"
              >
                Transaction Amount (USD)
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="transactionAmount"
                  step="any"
                  value={formData.transaction_amount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    // setStakeAmount(value);
                    setFormData({
                      ...formData,
                      transaction_amount: value,
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                The exact amount involved in the transaction
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Report Summary
              </h3>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Title
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formData.title}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Scammer Address
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono break-all">
                    {formData.scammer_address}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Scam Type
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {scamTypes.find((type) => type.value === formData.scam_type)
                      ?.label || formData.scam_type}
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

                {formData.contact_info && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Scammer's Contact Info
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formData.contact_info}
                    </span>
                  </div>
                )}

                {formData.transaction_hash && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Transaction Hash
                    </span>
                    <span className="text-gray-900 dark:text-white font-mono break-all">
                      {formData.transaction_hash}
                    </span>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Evidence Files
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formData.evidence_files.length} files uploaded
                  </span>
                </div>

                {formData.additional_details && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Additional Evidence Details
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formData.additional_details}
                    </span>
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Reporter Address
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono break-all">
                    {account?.address || "Not connected"}
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

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Transaction Amount
                  </span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    {formData.transaction_amount} USD
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
                disabled={isSubmitting || !account?.address}
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
                    Submitting Report...
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
