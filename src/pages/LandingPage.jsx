import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@suiet/wallet-kit";
import {
  Shield,
  Search,
  AlertCircle,
  Users,
  TrendingUp,
  Database,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  X,
} from "lucide-react";
import { useWalletStore } from "../stores/walletStore";
import axiosClient from "../utils/apiClient";
// import { setWalletAddress } from "../utils/apiClient";

const StatsCard = ({ icon: Icon, title, value, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col h-full">
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/40">
        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
      {value}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full">
    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/40 inline-block mb-4">
      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

const ProcessStep = ({ number, title, description }) => (
  <li className="flex items-start">
    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center mt-1">
      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
        {number}
      </span>
    </div>
    <div className="ml-3">
      <p className="text-gray-800 dark:text-gray-200 font-medium">{title}</p>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
        {description}
      </p>
    </div>
  </li>
);

const WalletSearch = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!walletAddress.trim()) return;

    setIsSearching(true);

    const response = await axiosClient.get(
      `/scammer-check/?address=${encodeURIComponent(walletAddress.trim())}`
    );
    setSearchResult(response.data);
    setIsSearching(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Verify Wallet Address
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Check if a wallet address has been reported as a scam in our database
      </p>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter SUI wallet address"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
            disabled={isSearching}
          >
            {isSearching ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Verify
          </button>
        </div>
      </form>

      {searchResult && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            searchResult.isScam
              ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          }`}
        >
          <div className="flex items-center mb-2">
            {searchResult.isScam ? (
              <>
                <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="ml-2 font-medium text-red-700 dark:text-red-400">
                  Suspicious Address Detected
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="ml-2 font-medium text-green-700 dark:text-green-400">
                  No Reports Found
                </span>
              </>
            )}
          </div>

          {searchResult.isScam ? (
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>
                <span className="font-medium">Reports:</span>{" "}
                {searchResult.reports}
              </p>
              <p>
                <span className="font-medium">Last Reported:</span>{" "}
                {searchResult.lastReported}
              </p>
              <p>
                <span className="font-medium">Risk Level:</span>{" "}
                {searchResult.severity}
              </p>
              <Link
                to={`/report-details/${walletAddress}`}
                className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center mt-2"
              >
                View detailed reports
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This address has not been reported in our database. Stay vigilant
              and report any suspicious activity.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const LandingPage = () => {
  const { clearWallet, isConnected } = useWalletStore();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden">
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
              <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-lg shadow-md mb-6">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Secure the SUI Ecosystem Against Fraud
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
                SUI ScamShield provides enterprise-grade security through
                decentralized verification, enabling developers and users to
                identify and avoid fraudulent activities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {isConnected() ? (
                  <Link
                    to="/dashboard"
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
                  >
                    Access Dashboard
                  </Link>
                ) : (
                  <div className="scale-110">
                    <ConnectButton onDisconnectSuccess={() => clearWallet()} />
                  </div>
                )}
                <Link
                  to="/search"
                  className="px-8 py-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg shadow-md transition-colors flex items-center"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Reports
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2">
              <WalletSearch />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={AlertCircle}
            title="Reports Submitted"
            value="2,458"
            description="Verified scam reports in our database"
          />
          <StatsCard
            icon={Users}
            title="Active Verifiers"
            value="542"
            description="Trusted validators securing the network"
          />
          <StatsCard
            icon={TrendingUp}
            title="Wallets Protected"
            value="18,940"
            description="Active users with ScamShield protection"
          />
          <StatsCard
            icon={Database}
            title="Value Secured"
            value="$1.2M"
            description="Estimated funds protected from scams"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Enterprise-Grade Protection
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            SUI ScamShield provides an institutional-quality security
            infrastructure that enables any participant to contribute to and
            benefit from collective defense.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                For Users
              </h3>
              <ul className="space-y-6">
                <ProcessStep
                  number="1"
                  title="Secure Authentication"
                  description="Connect your SUI wallet with multi-factor authentication"
                />
                <ProcessStep
                  number="2"
                  title="Report Suspicious Activity"
                  description="Submit detailed reports with automated evidence collection"
                />
                <ProcessStep
                  number="3"
                  title="Build Reputation"
                  description="Earn trust scores through accurate reporting and verification"
                />
                <ProcessStep
                  number="4"
                  title="Real-time Protection"
                  description="Receive instant alerts about emerging threats and vulnerabilities"
                />
              </ul>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                For Developers
              </h3>
              <ul className="space-y-6">
                <ProcessStep
                  number="1"
                  title="Enterprise API Integration"
                  description="Implement our SDK with single-line integration in any project"
                />
                <ProcessStep
                  number="2"
                  title="Real-time Transaction Verification"
                  description="Cross-reference activities against our secure database"
                />
                <ProcessStep
                  number="3"
                  title="Risk Assessment Tools"
                  description="Deploy multi-level threat detection for your users"
                />
                <ProcessStep
                  number="4"
                  title="Collective Security Network"
                  description="Contribute to and benefit from ecosystem-wide protection"
                />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced Security Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            SUI ScamShield leverages blockchain technology to provide
            comprehensive protection against evolving threats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Shield}
            title="Immutable Reporting System"
            description="Submit and verify fraud reports directly on-chain with cryptographic proof for transparent record-keeping."
          />
          <FeatureCard
            icon={Users}
            title="Consensus-Based Verification"
            description="Multi-signature verification protocol ensures all reports meet stringent accuracy standards."
          />
          <FeatureCard
            icon={Search}
            title="Advanced Reputation Framework"
            description="Weighted trust scoring system built on historical accuracy and stake-based verification."
          />
          <FeatureCard
            icon={Database}
            title="Enterprise Integration"
            description="Comprehensive SDK with GraphQL API for seamless security integration into any SUI application."
          />
          <FeatureCard
            icon={AlertCircle}
            title="Threat Intelligence Network"
            description="Real-time notification system for emerging threats with severity classification."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Security Analytics"
            description="Advanced visualization and trend analysis to monitor ecosystem security metrics."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-3xl overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Join the Collective Defense Network
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mb-8">
              Secure your assets and contribute to protecting the entire SUI
              ecosystem from fraud.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isConnected() ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-3.5 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg shadow-md transition-colors flex items-center"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Access Dashboard
                </Link>
              ) : (
                <div className="scale-110">
                  <ConnectButton onDisconnectSuccess={() => clearWallet()} />
                </div>
              )}
              <Link
                to="/docs"
                className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-colors flex items-center"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Developer Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
