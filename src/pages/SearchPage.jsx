import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  AlertCircle,
  ExternalLink,
  Shield,
  Clock,
  Loader2,
} from "lucide-react";
import axiosClient from "../utils/apiClient";

const SearchResult = ({ report }) => {
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

  const formatScamType = (type) => {
    const typeMap = {
      website: "Website",
      smart_contract: "Smart Contract",
      social_media: "Social Media",
      application: "Application",
      phishing: "Phishing",
    };
    return typeMap[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatStatus = (status) => {
    const statusMap = {
      verified: "Verified",
      pending: "Under Review",
      rejected: "Rejected",
    };
    return statusMap[status] || status.replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatRiskLevel = (risk) => {
    return risk.replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {report.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {formatScamType(report.scam_type)}
            </span>
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                statusColors[report.status]
              }`}
            >
              {formatStatus(report.status)}
            </span>
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                riskColors[report.risk_level]
              }`}
            >
              {formatRiskLevel(report.risk_level)} Risk
            </span>
          </div>
        </div>
        <Link
          to={`/reports/${report.id}`}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span className="text-sm mr-1">View</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        <div className="flex items-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm mr-2">
            Reporter:
          </span>
          <span className="text-gray-700 dark:text-gray-300 text-sm truncate">
            {report.reporter_address.slice(0, 6)}...{report.reporter_address.slice(-4)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-1" />
          <span>
            {report.verification_count} {report.verification_count === 1 ? 'verification' : 'verifications'}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Reported {formatDate(report.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ filters, setFilters }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h3>
        <button
          onClick={() =>
            setFilters({
              type: "all",
              status: "all",
              riskLevel: "all",
              dateRange: "all",
            })
          }
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="website">Website</option>
            <option value="smart_contract">Smart Contract</option>
            <option value="social_media">Social Media</option>
            <option value="application">Application</option>
            <option value="phishing">Phishing</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Under Review</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Risk Level
          </label>
          <select
            value={filters.riskLevel}
            onChange={(e) =>
              setFilters({ ...filters, riskLevel: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) =>
              setFilters({ ...filters, dateRange: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    riskLevel: "all",
    dateRange: "all",
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("date-desc");

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/reports/");
        setReports(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch reports. Please try again later.");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filter and search logic
  const filteredReports = useMemo(() => {
    let filtered = reports;

    // Apply search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchLower) ||
          report.reporter_address.toLowerCase().includes(searchLower) ||
          report.scammer_address.toLowerCase().includes(searchLower) ||
          report.scam_type.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters.type !== "all") {
      filtered = filtered.filter((report) => report.scam_type === filters.type);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((report) => report.status === filters.status);
    }

    if (filters.riskLevel !== "all") {
      filtered = filtered.filter((report) => report.risk_level === filters.riskLevel);
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      let filterDate = new Date();
      
      switch (filters.dateRange) {
        case "day":
          filterDate.setDate(now.getDate() - 1);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          filterDate = null;
      }

      if (filterDate) {
        filtered = filtered.filter(
          (report) => new Date(report.created_at) >= filterDate
        );
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.created_at) - new Date(a.created_at);
        case "date-asc":
          return new Date(a.created_at) - new Date(b.created_at);
        case "risk-desc":
          const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return riskOrder[b.risk_level] - riskOrder[a.risk_level];
        case "verifications-desc":
          return b.verification_count - a.verification_count;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reports, searchTerm, filters, sortBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-lg text-gray-600 dark:text-gray-300">
            Loading reports...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
          Error Loading Reports
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full shadow-md mb-6">
            <Search className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Search Scam Reports
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Search through verified scam reports submitted by the SUI community
            to protect yourself.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by title, address, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterSection filters={filters} setFilters={setFilters} />

      {/* Results Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Found {filteredReports.length} reports
          </h2>
        </div>
        <div className="flex items-center">
          <label
            htmlFor="sort"
            className="mr-2 text-gray-700 dark:text-gray-300"
          >
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="risk-desc">Highest Risk</option>
            <option value="verifications-desc">Most Verified</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredReports.map((report) => (
          <SearchResult key={report.id} report={report} />
        ))}
      </div>

      {/* No Results */}
      {filteredReports.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-10 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No reports found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search terms or filters to find what you're
            looking for.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({
                type: "all",
                status: "all",
                riskLevel: "all",
                dateRange: "all",
              });
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Report CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Found a scam that's not listed?
        </h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Help protect the SUI community by submitting a new scam report. Your
          contribution helps keep everyone safe.
        </p>
        <Link
          to="/report"
          className="px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg shadow-md transition-colors inline-flex items-center"
        >
          <Shield className="h-5 w-5 mr-2" />
          Submit a New Report
        </Link>
      </div>
    </div>
  );
};

export default SearchPage;