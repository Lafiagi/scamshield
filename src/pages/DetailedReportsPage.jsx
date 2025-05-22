import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Calendar,
  User,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axiosClient from "../utils/apiClient";
import { formatDistanceToNow, parseISO } from "date-fns";
import { truncateAddress } from "../utils/helpers";
import { formatCurrency } from "@suiet/wallet-kit";

const DetailedReportsPage = () => {
  const { scammerAddress } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      if (!scammerAddress) {
        setError("No wallet address provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosClient.get(
          `/reports?scammer_address=${encodeURIComponent(
            scammerAddress.trim()
          )}`
        );
        setReports(response.data?.results || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to fetch reports. Please try again later.");
        setLoading(false);
      }
    };

    fetchReports();
  }, [scammerAddress]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scammerAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderRiskLevelBadge = (riskLevel) => {
    const riskLevelMap = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };

    return (
      <span
        className={`text-xs font-medium px-2.5 py-0.5 rounded ${
          riskLevelMap[riskLevel.toLowerCase()] || riskLevelMap.medium
        }`}
      >
        {riskLevel.toUpperCase()}
      </span>
    );
  };

  const renderStatusBadge = (status) => {
    const statusMap = {
      verified:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <span
        className={`text-xs font-medium px-2.5 py-0.5 rounded ${
          statusMap[status.toLowerCase()] || statusMap.pending
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/search"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Search
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reports for Address
            </h1>
            <div className="flex items-center mt-2">
              <span className="font-mono text-gray-700 dark:text-gray-300">
                {truncateAddress(scammerAddress, 12)}
              </span>
              <button
                onClick={copyToClipboard}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-500">
                {reports.length} {reports.length === 1 ? "Report" : "Reports"}{" "}
                Filed
              </span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200">
              No reports found for this address.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports &&
              reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {report.title}
                    </h3>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      {renderRiskLevelBadge(report.risk_level)}
                      {renderStatusBadge(report.status)}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {report.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Reported{" "}
                        {formatDistanceToNow(parseISO(report.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      <span>
                        By{" "}
                        {report.reporter_address
                          ? truncateAddress(report.reporter_address, 8)
                          : "Anonymous"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Scam Type
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {report.scam_type}
                      </span>
                    </div>

                    {report.transaction_amount && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Transaction Amount
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(report.transaction_amount)} USD
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {report.verification_count} Verification
                        {report.verification_count !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {report.rejection_count} Rejection
                        {report.rejection_count !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Stake: {report.stake_amount} SUI
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Verification Deadline:{" "}
                      {new Date(
                        report.verification_deadline
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedReportsPage;
