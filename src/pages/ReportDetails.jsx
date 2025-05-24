import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useWallet } from "@suiet/wallet-kit";
import {
  Shield,
  AlertCircle,
  Calendar,
  ExternalLink,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Clock,
  Check,
  X,
  Info,
  Code,
  Loader,
  Share2,
  ChevronLeft,
  AlertTriangle,
  Link as LinkIcon,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import axiosClient from "../utils/apiClient";
import { toast } from "react-toastify";
import { Transaction } from "@mysten/sui/transactions";
import { useWalletStore } from "../stores/walletStore";
import { truncateAddress } from "../utils/helpers";

// Evidence item component with improved styling
const EvidenceItem = ({ evidence }) => {
  const getIconByType = (type) => {
    switch (type) {
      case "transaction":
        return <ExternalLink className="h-5 w-5" />;
      case "screenshot":
        return <Info className="h-5 w-5" />;
      case "report":
        return <Flag className="h-5 w-5" />;
      case "code":
        return <Code className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
      <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
        {getIconByType(evidence.type)}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="font-semibold text-gray-900 dark:text-white capitalize">
            {evidence.type}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(evidence.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {evidence.description}
        </p>
        <a
          href={evidence.file}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 flex items-center hover:underline group"
        >
          <span>View evidence</span>
          <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};

// Verification item component with improved styling
const VerificationItem = ({ verification }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 py-4 last:border-0">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <div
          className={`p-1.5 rounded-full ${
            verification.verified
              ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
          } mr-2`}
        >
          {verification.verified ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </div>
        <span className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
          {verification.verifier?.substring(0, 6)}...
          {verification.verifier?.substring(verification.verifier.length - 4)}
        </span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(verification.timestamp).toLocaleDateString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </span>
    </div>
    {verification.comment && (
      <p className="text-gray-600 dark:text-gray-300 text-sm pl-7">
        "{verification.comment}"
      </p>
    )}
  </div>
);

// Timeline item component with improved styling
const TimelineItem = ({ item, isLast }) => (
  <div className="flex">
    <div className="flex flex-col items-center mr-4">
      <div className="rounded-full h-3 w-3 bg-blue-500 dark:bg-blue-400 shadow-md shadow-blue-500/20"></div>
      {!isLast && (
        <div className="h-full w-0.5 bg-gradient-to-b from-blue-500 to-blue-200 dark:from-blue-400 dark:to-blue-800/20"></div>
      )}
    </div>
    <div className="pb-6">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {new Date(item.date).toLocaleDateString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </p>
      <p className="text-gray-900 dark:text-white">{item.event}</p>
    </div>
  </div>
);

// Main component
const ReportDetails = () => {
  const { id } = useParams();
  const { signAndExecuteTransaction } = useWallet();
  const { walletAddress, isConnected } = useWalletStore();
  const navigate = useNavigate();

  // State management
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationInput, setVerificationInput] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [isBlockchainSubmitting, setIsBlockchainSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const SMART_CONTRACT_CONFIG = {
    PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID,
    CLOCK_OBJECT_ID: "0x6",
    REGISTRY_OBJECT_ID: import.meta.env.VITE_REGISTRY_OBJECT_ID,
  };

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get(`/reports/${id}/`);
        setReport(response.data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError(
          err.response?.data?.message || "Failed to fetch report details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  // Copy to clipboard functionality
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied to clipboard!");
  };

  // Handle blockchain submission
  const submitToBlockchain = async (isVerified) => {
    if (!walletAddress) {
      throw new Error("Wallet not connected");
    }

    setIsBlockchainSubmitting(true);

    try {
      const tx = new Transaction();

      // Prepare arguments for smart contract
      const args = [
        tx.object(report.sui_object_id),
        tx.object(SMART_CONTRACT_CONFIG.CLOCK_OBJECT_ID), // clock
        tx.pure.bool(isVerified),
        tx.pure.string(verificationInput.trim() || ""),
      ];

      // Call smart contract function
      tx.moveCall({
        target: `${SMART_CONTRACT_CONFIG.PACKAGE_ID}::report_registry::verify_report`,
        arguments: args,
      });

      // Sign and execute transaction
      const result = await signAndExecuteTransaction({
        transaction: tx,
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });

      console.log("Verification Transaction result:", JSON.stringify(result));
      if (!result?.digest) {
        throw new Error("Transaction failed");
      }
      toast.success("Report submitted to blockchain successfully!");
      return result?.digest;
    } catch (error) {
      console.error("Blockchain submission error:", error);
      toast.error(`Blockchain submission failed: ${error.message}`);
      throw error;
    } finally {
      setIsBlockchainSubmitting(false);
    }
  };

  // Handle verification
  const handleVerify = async (isVerified) => {
    if (!isConnected()) {
      toast.error("Please connect your wallet to verify this report");
      return;
    }

    try {
      setVerifyLoading(true);
      const result = await submitToBlockchain(isVerified);
      const response = await axiosClient.post(`/reports/${id}/verify/`, {
        verified: isVerified,
        comment: verificationInput.trim() || null,
        transaction_hash: result,
      });

      setVerifyStatus(isVerified ? "verified" : "rejected");
      setVerificationInput("");

      toast.success(
        isVerified
          ? "You've successfully verified this report!"
          : "You've rejected this report."
      );

      // Update the report with the new verification
      if (response.data) {
        setReport((prev) => ({
          ...prev,
          verificationCount: prev.verificationCount + 1,
          verifications: [response.data, ...prev.verifications],
        }));
      }
    } catch (err) {
      console.error("Error submitting verification:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to submit verification. Please try again."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
        <Loader className="h-12 w-12 text-blue-500 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Loading Report
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center">
          Please wait while we fetch the report details...
        </p>
      </div>
    );
  }

  // Error state
  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
        <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {error ? "Error Loading Report" : "Report Not Found"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-6">
          {error ||
            "The report you're looking for doesn't exist or has been removed."}
        </p>
        <Link
          to="/search"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
        >
          Back to Search
        </Link>
      </div>
    );
  }

  // Status and risk level styling
  const statusColors = {
    verified:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800",
    "under review":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    rejected:
      "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800",
    pending:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  };

  const riskColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    critical:
      "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800",
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header with Back Link */}
      <div className="flex items-center mb-8">
        <button
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Back to Reports</span>
        </button>
      </div>

      {/* Report Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                <Shield className="h-6 w-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {report.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 font-medium">
                {report.scam_type}
              </span>
              <span
                className={`text-xs px-3 py-1.5 rounded-full capitalize font-medium border ${
                  statusColors[report.status?.toLowerCase() || "pending"]
                }`}
              >
                {report.status}
              </span>
              <span
                className={`text-xs px-3 py-1.5 rounded-full capitalize font-medium border ${
                  riskColors[report.risk_level?.toLowerCase() || "medium"]
                }`}
              >
                {report.risk_level} Risk
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full capitalize font-medium border bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                {report.network}
              </span>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>
                  Reported on {new Date(report.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>
                  Verification deadline:{" "}
                  {new Date(report.verification_deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl mb-2">
              <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40">
                <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {report.verificationCount}{" "}
                {report.verificationCount === 1
                  ? "Verification"
                  : "Verifications"}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {report.rejection_count}{" "}
              {report.rejection_count === 1 ? "Rejection" : "Rejections"}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mt-2">
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-1.5" />
            ) : (
              <Copy className="h-4 w-4 mr-1.5" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <a
            href={`https://${report.network}.suivision.xyz/txblock/${report.transaction_digest}?tab=Overview`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              !report.transaction_digest ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <ExternalLink className="h-4 w-4 mr-1.5" />
            Blockchain Record
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Scam Alert
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              {report.description}
            </p>

            <div className="space-y-4">
              {/* Scammer Address */}
              {report.scammer_address && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50">
                  <span className="font-medium text-red-800 dark:text-red-300 whitespace-nowrap">
                    Scammer Address:
                  </span>
                  <div className="flex items-center gap-2 flex-1">
                    <code className="p-1.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-mono flex-1 overflow-x-auto whitespace-nowrap">
                      {truncateAddress( report.scammer_address, 20)}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(report.scammer_address);
                        toast.success("Address copied to clipboard!");
                      }}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* URL if available */}
              {report.url && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                  <span className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Malicious URL:
                  </span>
                  <div className="flex items-center gap-2 flex-1">
                    <code className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-mono flex-1 overflow-x-auto whitespace-nowrap">
                      {report.url}
                    </code>
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Contact info if available */}
              {report.contact_info && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                  <span className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Contact:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {report.contact_info}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Evidence */}
          {report.evidence && report.evidence.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2 text-blue-500" />
                Evidence
              </h2>
              <div className="space-y-4">
                {report.evidence.map((item, index) => (
                  <EvidenceItem key={index} evidence={item} />
                ))}
              </div>
            </div>
          )}

          {/* Scam Tactics */}
          {report.scamTactics && report.scamTactics.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Flag className="h-5 w-5 mr-2 text-red-500" />
                Scam Tactics
              </h2>
              <ul className="space-y-3">
                {report.scamTactics.map((tactic, index) => (
                  <li key={index} className="flex items-start">
                    <div className="p-1 rounded-full bg-red-100 dark:bg-red-900/30 mr-3 mt-0.5">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {tactic}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verification Form */}
          {report.user_can_verify ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-blue-500" />
                Verify This Report
              </h2>
              {verifyStatus ? (
                <div
                  className={`p-4 mb-4 rounded-xl ${
                    verifyStatus === "verified"
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 text-green-800 dark:text-green-200"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-200"
                  }`}
                >
                  <p className="flex items-center">
                    {verifyStatus === "verified" ? (
                      <Check className="h-5 w-5 mr-2" />
                    ) : (
                      <X className="h-5 w-5 mr-2" />
                    )}
                    Thank you for your contribution! Your{" "}
                    {verifyStatus === "verified" ? "verification" : "rejection"}{" "}
                    has been submitted and recorded on the blockchain.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Have you encountered this scam? Help protect the community
                    by verifying this report.
                  </p>
                  <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    <div className="flex items-start mb-2">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Your verification will be recorded on the blockchain and
                        help others identify this scam. You can add an optional
                        comment to provide more context.
                      </p>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Comment (Optional)
                    </label>
                    <textarea
                      id="comment"
                      value={verificationInput}
                      onChange={(e) => setVerificationInput(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Share your experience or add more details..."
                      disabled={verifyLoading}
                    ></textarea>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleVerify(true)}
                      className="flex items-center justify-center px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isConnected() || verifyLoading}
                    >
                      {verifyLoading ? (
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ThumbsUp className="h-4 w-4 mr-2" />
                      )}
                      Verify Report
                    </button>
                    <button
                      onClick={() => handleVerify(false)}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isConnected() || verifyLoading}
                    >
                      {verifyLoading ? (
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ThumbsDown className="h-4 w-4 mr-2" />
                      )}
                      Reject Report
                    </button>
                  </div>
                  {!isConnected() && (
                    <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                      Connect your wallet to verify this report
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-10">
              <div className="flex items-start">
                <span className="font-semibold mr-2 text-white">Notice:</span>
                {report.reporter_address === walletAddress ? (
                  <span className="text-gray-100 dark:text-gray-400 mb-4">
                    You submitted this report. You cannot verify your own
                    report.
                  </span>
                ) : (
                  <span className="text-gray-100 dark:text-gray-400 mb-4">
                    You have already verified or rejected this report. Thank you
                    for your contribution!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Reported By */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Reported By
            </h2>
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">
                  Anonymous
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {report.reporter_address?.substring(0, 6)}...
                  {report.reporter_address?.substring(
                    report.reporter_address.length - 4
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {report.timeline && report.timeline.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Timeline
              </h2>
              <div className="pt-2">
                {report.timeline.map((item, index) => (
                  <TimelineItem
                    key={index}
                    item={item}
                    isLast={index === report.timeline.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Community Verification */}
          {report.verifications && report.verifications.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Community Verification
              </h2>
              <div>
                {report.verifications.map((item, index) => (
                  <VerificationItem key={index} verification={item} />
                ))}
              </div>
            </div>
          )}

          {/* Share Report */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Share Report
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Help others stay safe by sharing this report.
            </p>
            <div className="flex space-x-3">
              <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 8c0 .557-.447 1.008-1 1.008s-1-.45-1-1.008c0-.557.447-1.008 1-1.008s1 .452 1 1.008zm0 2h-2v6h2v-6zm3 0h-2v6h2v-2.861c0-1.722 2.002-1.881 2.002 0v2.861h1.998v-3.359c0-3.284-3.128-3.164-4-1.548v-1.093z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
