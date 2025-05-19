import React from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@suiet/wallet-kit";
import {
  Shield,
  Search,
  AlertCircle,
  Users,
  TrendingUp,
  Database,
} from "lucide-react";
import { useWalletStore } from "../stores/walletStore";
// import { setWalletAddress } from "../utils/apiClient";

const StatsCard = ({ icon: Icon, title, value, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col">
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
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
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 inline-block mb-4">
      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

const LandingPage = () => {
  const { clearWallet, isConnected } = useWalletStore();
  return (
    <div className="space-y-16 pb-10">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-full shadow-lg mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
              Protect the SUI Ecosystem from Scams
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8">
              SUI ScamShield is a decentralized infrastructure enabling users to
              report, verify, and protect against scam activities in the SUI
              ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isConnected() ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="scale-110">
                  <ConnectButton onDisconnectSuccess={() => clearWallet()} />
                </div>
              )}
              <Link
                to="/search"
                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg shadow-md transition-colors"
              >
                Search Reports
              </Link>
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
            description="Total scam reports submitted by users"
          />
          <StatsCard
            icon={Users}
            title="Active Verifiers"
            value="542"
            description="Community members helping verify reports"
          />
          <StatsCard
            icon={TrendingUp}
            title="Wallets Protected"
            value="18,940"
            description="Wallets using ScamShield protection"
          />
          <StatsCard
            icon={Database}
            title="Scams Prevented"
            value="$1.2M"
            description="Estimated value protected"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            SUI ScamShield creates a decentralized infrastructure that enables
            anyone to report and verify scams, helping protect the entire
            ecosystem.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                For Users
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      1
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      Connect your SUI wallet to the platform
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      2
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      Submit reports with evidence of scam activity
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      3
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      Earn reputation by submitting accurate reports
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      4
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      Stay protected with real-time alerts about suspicious
                      activities
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                For Developers
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      1
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      Integrate ScamShield SDK into your dApp or wallet
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      2
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      Verify transactions against the scam database in real-time
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      3
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      Add scam warnings and protection for your users
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      4
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700 dark:text-gray-300">
                      Contribute to the shared security infrastructure of SUI
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Key Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            SUI ScamShield provides a comprehensive set of tools for the
            community to combat scams together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Shield}
            title="Decentralized Reporting"
            description="Submit scam reports directly on-chain with evidence for transparent, immutable record-keeping."
          />
          <FeatureCard
            icon={Users}
            title="Community Verification"
            description="Stake-based verification system ensures reports are accurate and reliable."
          />
          <FeatureCard
            icon={Search}
            title="Reputation System"
            description="Build reputation as a trusted reporter by submitting accurate and well-documented reports."
          />
          <FeatureCard
            icon={Database}
            title="Developer SDK"
            description="Easily integrate scam protection into any SUI wallet or dApp with our developer toolkit."
          />
          <FeatureCard
            icon={AlertCircle}
            title="Real-time Alerts"
            description="Get instant notifications about new scams targeting SUI users."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Analytics Dashboard"
            description="Track scam trends and monitor the security health of the SUI ecosystem."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 rounded-3xl overflow-hidden">
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Join the Fight Against Scammers in the SUI Ecosystem
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mb-8">
              Connect your wallet today to start reporting scams and help
              protect the SUI community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isConnected() ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg shadow-md transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="scale-110">
                  <ConnectButton onDisconnectSuccess={() => clearWallet()} />
                </div>
              )}
              <Link
                to="/search"
                className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg shadow-md transition-colors"
              >
                Browse Reports
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
