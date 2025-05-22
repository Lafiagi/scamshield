import { useState, useEffect } from "react";
import {
  Clock,
  Check,
  X,
  Users,
  AlertTriangle,
  Filter,
  Search,
  Shield,
  ArrowUpDown,
  DollarSign,
  BarChart3,
  ExternalLink,
  Copy,
  Wallet,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import _ from "lodash";
import { Link } from "react-router-dom";
import axiosClient from "../utils/apiClient";
import TopScamTypes from "../components/TopScamTypes";

// Format date to be more readable
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get time remaining until deadline
const getTimeRemaining = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
};

// Risk level badge component
const RiskBadge = ({ level }) => {
  const getBadgeColor = () => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}
    >
      <AlertTriangle className="h-3 w-3 mr-1" />
      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
    </div>
  );
};

// Report card component
const ReportCard = ({ report }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "verified":
        return <Check className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getScamTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "impersonation":
        return <AlertCircle className="h-4 w-4" />;
      case "airdrop":
        return <DollarSign className="h-4 w-4" />;
      case "wallet":
        return <Wallet className="h-4 w-4" />;
      case "website":
      case "phishing":
        return <ExternalLink className="h-4 w-4" />;
      case "social_media":
        return <MessageSquare className="h-4 w-4" />;
      case "fake_investment":
      case "fake_defi":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between mb-2">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="mr-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center">
            {getScamTypeIcon(report.scam_type)}
            <span className="ml-1 capitalize">
              {report.scam_type.replace("_", " ")}
            </span>
          </div>
          <RiskBadge level={report.risk_level} />
        </div>
        <div
          className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            report.status
          )}`}
        >
          {getStatusIcon(report.status)}
          <span className="ml-1 capitalize">{report.status}</span>
        </div>
      </div>

      <div className="cursor-pointer">
        <Link to={`/reports/${report?.id}`} className="block">
          <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-lg hover:text-blue-600 transition-colors">
            {report.title}
          </h3>
        </Link>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span className="mr-2">{formatDate(report.created_at)}</span>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {getTimeRemaining(report.verification_deadline)}
          </span>
        </div>

        <p
          className={`text-gray-600 dark:text-gray-300 text-sm ${
            expanded ? "" : "line-clamp-2"
          }`}
        >
          {report.description}
        </p>
      </div>
    </div>
  );
};

// Stats card component
const StatsCard = ({ icon, title, value, trend, change }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-end">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <div
            className={`ml-2 mb-1 flex items-center text-xs font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <span>↑ {change}%</span>
            ) : (
              <span>↓ {change}%</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [selectedTab, setSelectedTab] = useState("all");
  const [apiKeys, setApiKeys] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);

  const fetchApiKeys = async () => {
    try {
      setApiLoading(true);
      const res = await axiosClient.get("/merchants/");
      setApiKeys(res.data || []);
    } catch (e) {
      console.error("Failed to fetch API keys", e);
    } finally {
      setApiLoading(false);
    }
  };

  const generateApiKey = async () => {
    try {
      setApiLoading(true);
      const res = await axiosClient.post("/merchants/1/generate_api_key/");
      setApiKeys(res.data);
    } catch (e) {
      console.error("Failed to generate API key", e);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get(`/dashboard-stats/`);
        setReports(response.data?.recentReports || []);
        setUserReports(response?.data?.myRecentReports || []);
        setStats(response?.data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError(
          err.response?.data?.message || "Failed to fetch report details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  // Filtered reports
  const getFilteredReports = () => {
    let filtered = reports;

    if (selectedTab === "my-reports") {
      filtered = userReports;
    }

    if (filter !== "all") {
      filtered = filtered.filter(
        (report) => report.status.toLowerCase() === filter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.scam_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.scammer_address
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          report.reporter_address
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Sort reports
    return _.orderBy(
      filtered,
      [(r) => new Date(r.created_at)],
      [sortBy === "newest" ? "desc" : "asc"]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={
              <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            }
            title="Total Reports"
            value={stats?.totalReports || 0}
            trend="up"
            change="12"
          />
          <StatsCard
            icon={
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            }
            title="Verified Scams"
            value={stats?.totalVerified || 0}
            trend="up"
            change="0"
          />
          <StatsCard
            icon={
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            }
            title="Pending Verification"
            value={stats?.totalPending || 0}
          />
          <StatsCard
            icon={
              <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400" />
            }
            title="Amount at Risk (USD)"
            value={stats?.preventedValue?.toLocaleString() || 0}
            trend="up"
            change="23"
          />
        </div>

        {/* Tabs & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row">
            <div className="flex border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedTab("all")}
                className={`px-4 py-3 text-sm font-medium ${
                  selectedTab === "all"
                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Most Recent Reports
              </button>
              <button
                onClick={() => setSelectedTab("my-reports")}
                className={`px-4 py-3 text-sm font-medium ${
                  selectedTab === "my-reports"
                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                My Reports ({userReports.length})
              </button>
            </div>

            <div className="flex-1 p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="block appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 pr-8 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="block appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 pr-8 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">
                  {selectedTab === "my-reports"
                    ? "My Reports"
                    : "Recent Reports"}
                </h2>
                <div className="flex items-center  mb-4">
                  <Link to={`/report`} className="block hover:underline">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium">
                      + New Report
                    </button>
                  </Link>
                  <Link to={`/search`} className="block hover:underline ml-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium">
                      View All
                      {(stats?.totalReports || 0) > 0
                        ? ` (${stats?.totalReports})`
                        : ""}
                    </button>
                  </Link>
                </div>
              </div>

              {getFilteredReports().length > 0 ? (
                <div className="space-y-4">
                  {getFilteredReports().map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-gray-500 dark:text-gray-400 mb-1">
                    No reports found
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    {searchTerm
                      ? "Try a different search term"
                      : "Be the first to report a scam"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium">API Access</h2>
                <a
                  href="/docs"
                  target="_blank"
                  className="text-sm text-blue-600 hover:underline"
                  rel="noopener noreferrer"
                >
                  API Docs
                </a>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Use your API key to programmatically submit reports or fetch
                scam data.
              </p>

              {apiLoading && (
                <p className="text-sm text-gray-400">Loading...</p>
              )}

              <div className="space-y-2">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-2 flex items-center justify-between text-sm text-gray-800 dark:text-gray-200">
                  <span>
                    {apiKeys[0]?.api_key?.slice(0, 10)}...
                    {apiKeys[0]?.api_key?.slice(-5)}
                  </span>
                  <button
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() =>
                      navigator.clipboard.writeText(apiKeys[0].api_key)
                    }
                  >
                    Copy
                  </button>
                </div>
              </div>

              <button
                onClick={generateApiKey}
                disabled={apiLoading}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
              >
                + Generate New Key
              </button>
            </div>

            {/* How it works */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-medium mb-3">How It Works</h2>
              <ul className="space-y-3">
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 mt-0.5">
                    1
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Report a Scam</strong> - Provide details and stake
                    SUI tokens
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 mt-0.5">
                    2
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Community Verification</strong> - Other users verify
                    your report
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 mt-0.5">
                    3
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Earn Rewards</strong> - Get SUI tokens for verified
                    reports
                  </div>
                </li>
              </ul>
            </div>

            {/* Top Scam Types */}
            <TopScamTypes stats={stats?.topScamTypes} />

            {/* Your Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-medium mb-3">Your Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Reports Submitted
                  </span>
                  <span className="font-medium">{userReports.length}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Reports Verified
                  </span>
                  <span className="font-medium">
                    {
                      userReports.filter(
                        (r) => r.status.toLowerCase() === "verified"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Total Staked
                  </span>
                  <span className="font-medium">
                    {userReports.reduce((sum, r) => sum + r.stake_amount, 0)}{" "}
                    SUI
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Rewards Earned
                  </span>
                  <span className="font-medium text-green-600">
                    {userReports
                      .filter((r) => r.rewardTokens)
                      .reduce((sum, r) => sum + (r.rewardTokens || 0), 0)}{" "}
                    SUI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
