import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, AlertCircle, Shield, Loader2 } from "lucide-react";
import axiosClient from "../utils/apiClient";
import SearchResult from "../components/SearchResult";

const FilterSection = ({ filters, setFilters }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
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
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="website">Website</option>
            <option value="wallet">Wallet</option>
            <option value="smart_contract">Smart Contract</option>
            <option value="social_media">Social Media</option>
            <option value="airdrop">Airdrop</option>
            <option value="impersonation">Impersonation</option>
            <option value="phishing">Phishing</option>
            <option value="fake_token">Fake Token</option>
            <option value="other">Other</option>
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
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
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
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Fetch reports from API
  const fetchReports = async (page = 1) => {
    try {
      const res = await axiosClient.get(`/reports/?page=${page}`);
      setReports(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 3));
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReports(page);
  }, [page]);

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
          report.scam_type.toLowerCase().includes(searchLower) ||
          (report.description &&
            report.description.toLowerCase().includes(searchLower)) ||
          (report.transaction_hash &&
            report.transaction_hash.toLowerCase().includes(searchLower))
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
      filtered = filtered.filter(
        (report) => report.risk_level === filters.riskLevel
      );
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
          const riskOrder = { high: 3, medium: 2, low: 1 };
          return riskOrder[b.risk_level] - riskOrder[a.risk_level];
        case "verifications-desc":
          return b.verification_count - a.verification_count;
        case "amount-desc":
          return (
            parseFloat(b.transaction_amount || 0) -
            parseFloat(a.transaction_amount || 0)
          );
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
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full shadow-md mb-4">
            <Search className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Search Scam Reports
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Search through verified scam reports to protect yourself and the SUI
            community
          </p>

          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by title, address, description, or transaction hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterSection filters={filters} setFilters={setFilters} />

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {filteredReports.length}{" "}
            {filteredReports.length === 1 ? "report" : "reports"} found
          </h2>
        </div>
        <div className="flex items-center">
          <label
            htmlFor="sort"
            className="mr-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="risk-desc">Highest Risk</option>
            <option value="verifications-desc">Most Verified</option>
            <option value="amount-desc">Highest Amount</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <SearchResult key={report.id} report={report} />
        ))}

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* No Results */}
      {filteredReports.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-10 text-center">
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
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Found a scam that's not listed?
        </h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Help protect the SUI community by submitting a new scam report. Your
          contribution helps keep everyone safe.
        </p>
        <Link
          to="/report"
          className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg shadow-md transition-colors"
        >
          <Shield className="h-5 w-5 mr-2" />
          Submit a New Report
        </Link>
      </div>
    </div>
  );
};

export default SearchPage;
