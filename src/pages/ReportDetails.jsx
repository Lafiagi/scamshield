// src/pages/ReportDetails.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";

// Mock data for demonstration
const MOCK_REPORTS = {
  1: {
    id: "1",
    title: "Fake SUI Mining Pool",
    type: "Website",
    status: "Verified",
    riskLevel: "High",
    reportedBy: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    reportDate: "2025-04-28",
    verificationCount: 12,
    description:
      "This website claims to offer SUI mining services but is actually a scam designed to steal user funds. The site mimics legitimate mining platforms but all deposited funds are immediately transferred to the scammer's wallet.",
    url: "https://fake-sui-mining.com",
    address: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3",
    evidence: [
      {
        type: "Transaction",
        description: "Fund withdrawal to known scammer wallet",
        link: "0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
      },
      {
        type: "Screenshot",
        description: "False guarantees of returns",
        link: "screenshot1.jpg",
      },
      {
        type: "Report",
        description: "Similar scam reported on SUI forums",
        link: "https://community.sui.io/t/scam-alert-fake-mining-pool",
      },
    ],
    verifications: [
      {
        verifier: "0x2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
        timestamp: "2025-04-29",
        verified: true,
        comment:
          "I can confirm this is a scam. Lost 50 SUI to this site before realizing.",
      },
      {
        verifier: "0x3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2e",
        timestamp: "2025-04-30",
        verified: true,
        comment:
          "Analyzed the contract, it has no withdrawal function for users.",
      },
    ],
    scamTactics: [
      "Promises unrealistic returns (25% daily)",
      'Fake testimonials from "successful miners"',
      'Urgency tactics claiming "limited spots available"',
      "Professional-looking but recently created website",
    ],
    timeline: [
      {
        date: "2025-04-25",
        event: "Website created",
      },
      {
        date: "2025-04-26",
        event: "First reported victim",
      },
      {
        date: "2025-04-28",
        event: "Report submitted to ScamShield",
      },
      {
        date: "2025-04-30",
        event: "Verified by community",
      },
    ],
  },
  2: {
    id: "2",
    title: "Fraudulent SUI Token Swap",
    type: "Smart Contract",
    status: "Under Review",
    riskLevel: "Medium",
    reportedBy: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
    reportDate: "2025-05-01",
    verificationCount: 5,
    description:
      "Smart contract that claims to swap tokens but actually drains user wallets once approval is given. The contract has a hidden function that transfers all approved tokens to the creator's wallet.",
    url: "",
    address: "0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
    evidence: [
      {
        type: "Code",
        description: "Malicious contract code",
        link: "https://explorer.sui.io/contract/0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
      },
      {
        type: "Transaction",
        description: "Exploit transaction",
        link: "0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      },
    ],
    verifications: [
      {
        verifier: "0x4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a",
        timestamp: "2025-05-02",
        verified: true,
        comment: "Code review confirms malicious functions in the contract.",
      },
      {
        verifier: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4f",
        timestamp: "2025-05-02",
        verified: false,
        comment: "I need more evidence to verify this claim.",
      },
    ],
    scamTactics: [
      "Impersonates legitimate DEX interface",
      "Offers slightly better exchange rates to lure victims",
      "Hidden functions in unverified smart contract",
      "Promoted through airdrop scams",
    ],
    timeline: [
      {
        date: "2025-04-29",
        event: "Contract deployed",
      },
      {
        date: "2025-04-30",
        event: "Promotion started on social media",
      },
      {
        date: "2025-05-01",
        event: "Report submitted to ScamShield",
      },
      {
        date: "2025-05-02",
        event: "Under community review",
      },
    ],
  },
};

const EvidenceItem = ({ evidence }) => (
  <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-3">
      {evidence.type === "Transaction" && <ExternalLink className="h-5 w-5" />}
      {evidence.type === "Screenshot" && <Info className="h-5 w-5" />}
      {evidence.type === "Report" && <Flag className="h-5 w-5" />}
      {evidence.type === "Code" && <Code className="h-5 w-5" />}
    </div>
    <div>
      <p className="font-medium text-gray-900 dark:text-white">
        {evidence.type}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {evidence.description}
      </p>
      <a
        href={evidence.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 dark:text-blue-400 flex items-center hover:underline"
      >
        {evidence.type === "Transaction" ? "View transaction" : "View evidence"}
        <ExternalLink className="h-3 w-3 ml-1" />
      </a>
    </div>
  </div>
);

const VerificationItem = ({ verification }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 py-4 last:border-0">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <div
          className={`p-1 rounded-full ${
            verification.verified
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
          } mr-2`}
        >
          {verification.verified ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </div>
        <span className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
          {verification.verifier.substring(0, 6)}...
          {verification.verifier.substring(verification.verifier.length - 4)}
        </span>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {verification.timestamp}
      </span>
    </div>
    <p className="text-gray-600 dark:text-gray-300 text-sm">
      {verification.comment}
    </p>
  </div>
);

const TimelineItem = ({ item, isLast }) => (
  <div className="flex">
    <div className="flex flex-col items-center mr-4">
      <div className="rounded-full h-3 w-3 bg-blue-600 dark:bg-blue-500"></div>
      {!isLast && (
        <div className="h-full w-0.5 bg-blue-200 dark:bg-blue-800"></div>
      )}
    </div>
    <div className="pb-6">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {item.date}
      </p>
      <p className="text-gray-900 dark:text-white">{item.event}</p>
    </div>
  </div>
);

const ReportDetails = () => {
  const { id } = useParams();
  const { connected } = useWallet();
  const report = MOCK_REPORTS[id];
  const [verificationInput, setVerificationInput] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(null);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Report Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The report you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/search"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
        >
          Back to Search
        </Link>
      </div>
    );
  }

  const statusColors = {
    Verified:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Under Review":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const riskColors = {
    Low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const handleVerify = (isVerified) => {
    if (!connected) {
      alert("Please connect your wallet to verify this report");
      return;
    }

    // Simulate verification process
    setVerifyStatus(isVerified ? "verified" : "rejected");

    // In a real app, you would submit this to the blockchain
    console.log(
      `Report ${report.id} ${
        isVerified ? "verified" : "rejected"
      }: ${verificationInput}`
    );

    // Reset form
    setVerificationInput("");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header with Back Link */}
      <div className="flex items-center mb-6">
        <Link
          to="/search"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
        >
          <svg
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Search
        </Link>
      </div>

      {/* Report Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {report.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {report.type}
            </span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                statusColors[report.status]
              }`}
            >
              {report.status}
            </span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                riskColors[report.riskLevel]
              }`}
            >
              {report.riskLevel} Risk
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Reported on {report.reportDate}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
            {report.verificationCount} Verifications
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {report.description}
            </p>

            {report.url && (
              <div className="flex items-center mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium mr-2">
                  URL:
                </span>
                <a
                  href={report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 hover:underline flex items-center"
                >
                  {report.url}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}

            {report.address && (
              <div className="flex items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium mr-2">
                  Address:
                </span>
                <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                  {report.address}
                </span>
              </div>
            )}
          </div>

          {/* Evidence */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Evidence
            </h2>
            <div className="space-y-3">
              {report.evidence.map((item, index) => (
                <EvidenceItem key={index} evidence={item} />
              ))}
            </div>
          </div>

          {/* Scam Tactics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Scam Tactics
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
              {report.scamTactics.map((tactic, index) => (
                <li key={index}>{tactic}</li>
              ))}
            </ul>
          </div>

          {/* Verification Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Verify This Report
            </h2>

            {verifyStatus ? (
              <div
                className={`p-4 mb-4 rounded-lg ${
                  verifyStatus === "verified"
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
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
                  has been submitted.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Have you encountered this scam? Help protect the community by
                  verifying this report.
                </p>

                <div className="mb-4">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Your Comment (Optional)
                  </label>
                  <textarea
                    id="comment"
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Share your experience or add more details..."
                  ></textarea>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleVerify(true)}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                    disabled={!connected}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Verify Report
                  </button>

                  <button
                    onClick={() => handleVerify(false)}
                    className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                    disabled={!connected}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Reject Report
                  </button>
                </div>

                {!connected && (
                  <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                    Connect your wallet to verify this report
                  </p>
                )}
              </>
            )}
          </div>
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
                  {report.reportedBy.substring(0, 6)}...
                  {report.reportedBy.substring(report.reportedBy.length - 4)}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
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

          {/* Community Verification */}
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
