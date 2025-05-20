import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@suiet/wallet-kit";
import {
  Shield,
  AlertCircle,
  FileText,
  Clock,
  Check,
  X,
  Search,
  TrendingUp,
  Users,
  ChevronRight,
} from "lucide-react";
import axiosClient from "../utils/apiClient";
import { useWalletStore } from "../stores/walletStore";

const StatsCard = ({ icon: Icon, title, value, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
      </div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>
    </div>
    <div className="flex items-end">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      {description && (
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
          {description}
        </span>
      )}
    </div>
  </div>
);

const ReportCard = ({ report, isUserReport }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Rejected":
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
      case "verified":
        return <Check className="h-4 w-4" />;
      case "Rejected":
      case "rejected":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-3">
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className="mr-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {report.type}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {report.reportDate}
          </span>
        </div>
        <div
          className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            report.status
          )}`}
        >
          {getStatusIcon(report.status)}
          <span className="ml-1">{report.status}</span>
        </div>
      </div>
      <Link to={`/reports/${report.id}`} className="block hover:underline">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
          {report.title}
        </h3>
      </Link>
      {isUserReport ? (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <div className="bg-gray-100 dark:bg-gray-700 h-2 w-24 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  report.status === "Confirmed" || report.status === "verified"
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
                style={{
                  width: `${
                    (report.currentVerifications /
                      report.requiredVerifications) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {report.currentVerifications}/{report.requiredVerifications}{" "}
              verifications
            </span>
          </div>
          {report.rewardTokens > 0 && (
            <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              <span>{report.rewardTokens} SUI</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center mt-2">
          <Users className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {report.verification_count} verifications
          </span>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalReports: 0,
    activeVerifiers: 0,
    protectedWallets: 0,
    preventedValue: "$0",
    recentReports: [],
    myReports: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { walletAddress, clearWallet, isConnected } = useWalletStore();

  // Fetch dashboard stats when component mounts or wallet connects
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!isConnected() || !walletAddress) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get(`/dashboard-stats/`);

        setStats(response.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(
          "Failed to load dashboard statistics. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [walletAddress]);

  // If not connected, redirect to landing page
  if (!isConnected()) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Wallet Not Connected
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to access the dashboard.
          </p>
          <div className="inline-block">
            <ConnectButton onDisconnectSuccess={() => clearWallet()} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your reports and account
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/report"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`inline-flex items-center py-3 px-4 text-sm font-medium ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Overview
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("myReports")}
              className={`inline-flex items-center py-3 px-4 text-sm font-medium ${
                activeTab === "myReports"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              My Reports
            </button>
          </li>
        </ul>
      </div>

      {/* Content */}
      {activeTab === "overview" ? (
        <>
          {/* Stats */}
          {error && (
            <div
              className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-200 dark:bg-gray-700 h-8 w-8 rounded-full mr-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                icon={FileText}
                title="Total Reports"
                value={stats.totalReports}
              />
              <StatsCard
                icon={Users}
                title="Active Verifiers"
                value={stats.activeVerifiers}
              />
              <StatsCard
                icon={Shield}
                title="Protected Wallets"
                value={stats.protectedWallets}
              />
              <StatsCard
                icon={TrendingUp}
                title="Prevented Value"
                value={stats.preventedValue}
              />
            </div>
          )}

          {/* Recent Reports & Search */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Recent Reports
                  </h2>
                  {stats?.recentReports?.length > 3 ? (
                    <Link
                      to="/search"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      View all
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  ) : null}
                </div>
                <div>
                  {stats?.recentReports?.length > 0 ? (
                    <div>
                      {stats?.recentReports?.map((report) => (
                        <ReportCard
                          key={report.id}
                          report={report}
                          isUserReport={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        No reports yet
                      </h3>

                      <Link
                        to="/report"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Submit a new report
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Quick Search
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Popular searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-600">
                      Phishing
                    </button>
                    <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-600">
                      Fake wallet
                    </button>
                    <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-600">
                      Scam
                    </button>
                    <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-600">
                      Malicious extension
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to="/verification-queue"
                    className="block w-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg p-4 hover:bg-blue-100 dark:hover:bg-blue-800"
                  >
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      <div>
                        <h3 className="font-medium">Verification Queue</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          Help verify reports
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // My Reports Tab
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              My Reports
            </h2>
            <Link
              to="/report"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              <FileText className="h-4 w-4 mr-1" />
              New Report
            </Link>
          </div>

          {stats?.myReports?.length > 0 ? (
            <div>
              {stats?.myReports?.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  isUserReport={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No reports yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't submitted any reports yet.
              </p>
              <Link
                to="/report"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit your first report
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
