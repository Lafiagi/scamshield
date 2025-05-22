import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  AlertCircle,
  ExternalLink,
  Shield,
  Clock,
  Loader2,
  DollarSign,
  Hash,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Copy,
  Check,
  ExternalLink as ExternalLinkIcon,
} from "lucide-react";

const SearchResult = ({ report }) => {
  const [copyStates, setCopyStates] = useState({
    scammerAddress: false,
    reporterAddress: false,
    transactionHash: false,
  });
  const [timeRemaining, setTimeRemaining] = useState("");

  const statusColors = {
    verified:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const riskColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  // Format deadline countdown
  useEffect(() => {
    if (!report?.verification_deadline) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const deadline = new Date(report.verification_deadline);
      const totalSeconds = Math.floor((deadline - now) / 1000);

      if (totalSeconds <= 0) {
        setTimeRemaining("Verification ended");
        return;
      }

      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h remaining`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s remaining`);
      } else {
        setTimeRemaining(`${seconds}s remaining`);
      }
    };

    calculateTimeRemaining();
    const intervalId = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(intervalId);
  }, [report?.verification_deadline]);

  const copyToClipboard = (text, field) => {
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      setCopyStates({ ...copyStates, [field]: true });

      // Reset the copy state after 2 seconds
      setTimeout(() => {
        setCopyStates({ ...copyStates, [field]: false });
      }, 2000);
    });
  };

  const formatScamType = (type) => {
    const typeMap = {
      website: "Website",
      wallet: "Wallet",
      smart_contract: "Smart Contract",
      social_media: "Social Media",
      airdrop: "Airdrop",
      impersonation: "Impersonation",
      phishing: "Phishing",
      fake_token: "Fake Token",
      other: "Other",
    };
    return (
      typeMap[type] ||
      type?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const formatStatus = (status) => {
    const statusMap = {
      verified: "Verified",
      pending: "Under Review",
      rejected: "Rejected",
    };
    return (
      statusMap[status] || status?.replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const formatRiskLevel = (risk) => {
    return risk?.replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (!amount || amount === "0.00") return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const truncateAddress = (address, length = 6) => {
    if (!address) return "N/A";
    return `${address.slice(0, length)}...${address.slice(-4)}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case "high":
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getDeadlineStatusClass = () => {
    if (!report.verification_deadline) return "";

    const now = new Date();
    const deadline = new Date(report.verification_deadline);

    if (deadline < now) {
      return "text-red-500 dark:text-red-400";
    } else {
      const hoursRemaining = Math.floor((deadline - now) / (1000 * 60 * 60));

      if (hoursRemaining < 24) {
        return "text-orange-500 dark:text-orange-400 animate-pulse";
      }
      return "text-green-500 dark:text-green-400";
    }
  };

  const getViewOnChainUrl = () => {
    if (!report?.transaction_digest || !report?.network) return null;
    return `https://${report.network}.suivision.xyz/txblock/${report.transaction_digest}?tab=Overview`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {report?.title}
            </h3>
            <div className="flex gap-2 mt-2 w-full flex-wrap sm:flex-nowrap">
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {formatScamType(report?.scam_type)}
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  statusColors[report?.status]
                }`}
              >
                {getStatusIcon(report?.status)}
                {formatStatus(report?.status)}
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                  riskColors[report?.risk_level]
                }`}
              >
                {getRiskIcon(report?.risk_level)}
                {formatRiskLevel(report?.risk_level)} Risk
              </span>
            </div>
          </div>
          <Link
            to={`/reports/${report?.id}`}
            className="ml-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors"
          >
            <span className="mr-1">View</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {/* Scammer Address with Copy Feature */}
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-gray-500 dark:text-gray-400 block">
                Scammer:
              </span>
              <div className="flex items-center">
                <span className="text-gray-900 dark:text-white font-mono text-xs mr-1">
                  {truncateAddress(report?.scammer_address, 8)}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(report?.scammer_address, "scammerAddress")
                  }
                  className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Copy address"
                >
                  {copyStates.scammerAddress ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Reporter with Copy Feature */}
          <div className="flex items-center">
            <User className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-gray-500 dark:text-gray-400 block">
                Reporter:
              </span>
              <div className="flex items-center">
                <span className="text-gray-900 dark:text-white font-mono text-xs mr-1">
                  {truncateAddress(report?.reporter_address, 8)}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(report?.reporter_address, "reporterAddress")
                  }
                  className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Copy address"
                >
                  {copyStates.reporterAddress ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Amount */}
          {report?.transaction_amount &&
            report?.transaction_amount !== "0.00" && (
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-gray-500 dark:text-gray-400 block">
                    Amount Lost:
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {formatAmount(report?.transaction_amount)}
                  </span>
                </div>
              </div>
            )}

          {/* Transaction Hash with Copy Feature and View on Chain Link */}
          {report?.transaction_digest && (
            <div className="flex items-center">
              <Hash className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-gray-500 dark:text-gray-400 block">
                  TX Hash:
                </span>
                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white font-mono text-xs mr-1">
                    {truncateAddress(report.transaction_digest, 8)}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        report.transaction_digest,
                        "transactionHash"
                      )
                    }
                    className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                    title="Copy transaction hash"
                  >
                    {copyStates.transactionHash ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                  {getViewOnChainUrl() && (
                    <a
                      href={getViewOnChainUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                      title="View on Chain"
                    >
                      <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Countdown Verification Deadline */}
          {report?.verification_deadline && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-gray-500 dark:text-gray-400 block">
                  Verification:
                </span>
                <span className={`font-medium ${getDeadlineStatusClass()}`}>
                  {timeRemaining}
                </span>
                <span className="text-xs text-gray-500 block">
                  ({formatDate(report.verification_deadline)})
                </span>
              </div>
            </div>
          )}

          {/* Stake Amount */}
          {report?.stake_amount && report.stake_amount > 0 && (
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-gray-500 dark:text-gray-400 block">
                  Stake:
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {report.stake_amount} SUI
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Description Preview */}
        {report?.description && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {report.description.length > 120
                ? `${report.description.substring(0, 120)}...`
                : report.description}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              {report?.verification_count} verified
            </span>
            <span className="flex items-center">
              <XCircle className="h-3 w-3 mr-1 text-red-500" />
              {report?.rejection_count} rejected
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDate(report?.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
