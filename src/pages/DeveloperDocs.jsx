import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Code,
  Server,
  Layers,
  Shield,
  Workflow,
  Link,
  CheckCircle,
  Copy,
} from "lucide-react";

export default function DeveloperDocs() {
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({
    architecture: false,
    api: true,
    components: false,
    models: false,
    authentication: false,
    workflow: false,
    integration: false,
    bestPractices: false,
  });

  // Copy code to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0">
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            ScamGuard Docs
          </h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${
                  activeSection === "overview"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("architecture");
                  toggleSection("architecture");
                }}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${
                  activeSection === "architecture"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Layers className="h-4 w-4 mr-2" />
                Architecture
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("api");
                  toggleSection("api");
                }}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${
                  activeSection === "api"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Server className="h-4 w-4 mr-2" />
                API Reference
                {expandedSections.api ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </button>
              {expandedSections.api && (
                <ul className="ml-6 mt-1 space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveSection("api-reports")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        activeSection === "api-reports"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Reports
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection("api-dashboard")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        activeSection === "api-dashboard"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection("api-merchants")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        activeSection === "api-merchants"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Merchants
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("components");
                  toggleSection("components");
                }}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${
                  activeSection === "components"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Code className="h-4 w-4 mr-2" />
                Components
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("models");
                  toggleSection("models");
                }}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${
                  activeSection === "models"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Layers className="h-4 w-4 mr-2" />
                Data Models
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("authentication");
                  toggleSection("authentication");
                }}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${
                  activeSection === "authentication"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Authentication
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("workflow");
                  toggleSection("workflow");
                }}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${
                  activeSection === "workflow"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Workflow className="h-4 w-4 mr-2" />
                Workflow
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("integration");
                  toggleSection("integration");
                }}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${
                  activeSection === "integration"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Link className="h-4 w-4 mr-2" />
                Integration Guide
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("bestPractices");
                  toggleSection("bestPractices");
                }}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${
                  activeSection === "bestPractices"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Best Practices
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {activeSection === "overview" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                ScamGuard Developer Documentation
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">
                  ScamGuard is a decentralized platform for reporting and
                  verifying cryptocurrency scams on the SUI blockchain. The
                  platform allows users to submit scam reports, stake SUI tokens
                  to validate their claims, and earn rewards for verified
                  reports. Community members can participate in the verification
                  process, helping to build a trustworthy database of known
                  scams.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Key Features
                  </h3>
                  <ul className="list-disc pl-5 text-blue-700 dark:text-blue-300 space-y-1">
                    <li>Report and track cryptocurrency scams</li>
                    <li>Community-driven verification process</li>
                    <li>Token staking and rewards system</li>
                    <li>Risk assessment and categorization</li>
                    <li>
                      API access for integration with external applications
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === "architecture" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Architecture
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">
                  The application consists of the following key components:
                </p>
                <ul className="space-y-4">
                  <li className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-lg">Frontend</h3>
                    <p>React-based user interface with Tailwind CSS styling</p>
                  </li>
                  <li className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-lg">Backend</h3>
                    <p>
                      RESTful API service that handles report management, user
                      authentication, and verification processes
                    </p>
                  </li>
                  <li className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-lg">
                      Blockchain Integration
                    </h3>
                    <p>
                      Smart contract integration with the SUI blockchain for
                      token staking and rewards
                    </p>
                  </li>
                  <li className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-lg">Data Storage</h3>
                    <p>
                      Database for storing report details, user information, and
                      verification status
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === "api" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                API Reference
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="font-medium text-lg mb-2">Base URL</h3>
                <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-6 flex justify-between items-center">
                  <code>/api/v1</code>
                  <button
                    onClick={() => copyToClipboard("/api/v1")}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="font-medium text-lg mb-2">Authentication</h3>
                <p className="mb-2">
                  All API requests require an API key passed in the header:
                </p>
                <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-6 flex justify-between items-center">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                  <button
                    onClick={() =>
                      copyToClipboard("Authorization: Bearer YOUR_API_KEY")
                    }
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="font-medium text-lg mb-2">Response Codes</h3>
                <div className="bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          200
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          Success
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          201
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          Resource created
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          400
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          Bad request
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          401
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          Unauthorized
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          404
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          Resource not found
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          500
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          Server error
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === "api-reports" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                API - Reports
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">Get Reports</h3>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 flex justify-between items-center">
                    <code>GET /reports/</code>
                    <button
                      onClick={() => copyToClipboard("GET /reports/")}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="font-medium">Query parameters:</h4>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>
                      <code>status</code>: Filter by status (pending, verified,
                      rejected)
                    </li>
                    <li>
                      <code>scam_type</code>: Filter by scam type
                    </li>
                    <li>
                      <code>sort</code>: Sort order (newest, oldest)
                    </li>
                    <li>
                      <code>search</code>: Search term for title or description
                    </li>
                    <li>
                      <code>page</code>: Page number
                    </li>
                    <li>
                      <code>limit</code>: Results per page
                    </li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">Create Report</h3>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 flex justify-between items-center">
                    <code>POST /reports/</code>
                    <button
                      onClick={() => copyToClipboard("POST /reports/")}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="font-medium">Request body:</h4>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 overflow-auto">
                    <pre>{`{
  "title": "Fake SUI Airdrop Scam",
  "description": "Website claiming to distribute free SUI tokens if users connect their wallet",
  "scam_type": "airdrop",
  "scammer_address": "0x123...abc",
  "evidence_urls": ["https://example.com/screenshot1.png"],
  "stake_amount": 10
}`}</pre>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    Get Report Details
                  </h3>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 flex justify-between items-center">
                    <code>GET /reports/{"{id}"}/</code>
                    <button
                      onClick={() => copyToClipboard("GET /reports/{id}/")}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">Verify Report</h3>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 flex justify-between items-center">
                    <code>POST /reports/{"{id}"}/verify/</code>
                    <button
                      onClick={() =>
                        copyToClipboard("POST /reports/{id}/verify/")
                      }
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="font-medium">Request body:</h4>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 overflow-auto">
                    <pre>{`{
  "vote": "verify",
  "stake_amount": 5,
  "comment": "I can confirm this is a scam. I found the same phishing site."
}`}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "api-dashboard" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                API - Dashboard
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    Get Dashboard Stats
                  </h3>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 flex justify-between items-center">
                    <code>GET /dashboard-stats/</code>
                    <button
                      onClick={() => copyToClipboard("GET /dashboard-stats/")}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="font-medium">Response:</h4>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 overflow-auto">
                    <pre>{`{
  "totalReports": 127,
  "totalVerified": 89,
  "totalPending": 32,
  "preventedValue": 103500,
  "recentReports": [...],
  "myRecentReports": [...],
  "topScamTypes": [...]
}`}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "api-merchants" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                API - Merchants
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    Get Merchant API Keys
                  </h3>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 flex justify-between items-center">
                    <code>GET /merchants/</code>
                    <button
                      onClick={() => copyToClipboard("GET /merchants/")}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">Generate API Key</h3>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 flex justify-between items-center">
                    <code>POST /merchants/{"{id}"}/generate_api_key/</code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          "POST /merchants/{id}/generate_api_key/"
                        )
                      }
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "components" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Components
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">Dashboard</h3>
                  <p>
                    The main dashboard displays key statistics, recent reports,
                    and user metrics. It includes:
                  </p>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>Total reports summary</li>
                    <li>Verified scams count</li>
                    <li>Reports pending verification</li>
                    <li>Amount at risk (USD)</li>
                    <li>Recent reports list</li>
                    <li>API key management</li>
                    <li>User stats</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">ReportCard</h3>
                  <p>Displays individual report information with:</p>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>Report title and description</li>
                    <li>Status (pending, verified, rejected)</li>
                    <li>Risk level (low, medium, high, critical)</li>
                    <li>Scam type with appropriate icon</li>
                    <li>Creation date and verification deadline</li>
                    <li>Link to detailed report view</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">RiskBadge</h3>
                  <p>
                    Visual indicator of the risk level associated with a
                    reported scam.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">TopScamTypes</h3>
                  <p>
                    Chart showing the distribution of scam types across the
                    platform.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "models" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Data Models
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">Report</h3>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 overflow-auto">
                    <pre>{`{
  id: string,
  title: string,
  description: string,
  reporter_address: string,
  scammer_address: string,
  scam_type: string,
  status: "pending" | "verified" | "rejected",
  risk_level: "low" | "medium" | "high" | "critical",
  evidence_urls: string[],
  stake_amount: number,
  created_at: string,
  updated_at: string,
  verification_deadline: string,
  verification_votes: {
    verify: number,
    reject: number
  },
  verifications: Verification[]
}`}</pre>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">Verification</h3>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 overflow-auto">
                    <pre>{`{
  id: string,
  report_id: string,
  verifier_address: string,
  vote: "verify" | "reject",
  stake_amount: number,
  comment: string,
  created_at: string
}`}</pre>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">User</h3>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 overflow-auto">
                    <pre>{`{
  address: string,
  reports_submitted: number,
  reports_verified: number,
  total_stake: number,
  rewards_earned: number,
  reputation_score: number,
  created_at: string
}`}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "authentication" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Authentication
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">
                  ScamGuard uses a combination of wallet-based authentication
                  for users and API keys for external applications.
                </p>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    Wallet Authentication
                  </h3>
                  <p>
                    Users authenticate by connecting their SUI wallet and
                    signing a message to verify ownership.
                  </p>
                  <h4 className="font-medium mt-4">Authentication Flow:</h4>
                  <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300">
                    <li>User initiates login by clicking "Connect Wallet"</li>
                    <li>
                      Application requests connection to user's SUI wallet
                    </li>
                    <li>User approves connection request in their wallet</li>
                    <li>Application generates a unique challenge message</li>
                    <li>User signs the message with their private key</li>
                    <li>
                      Application verifies the signature and establishes session
                    </li>
                  </ol>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    API Key Authentication
                  </h3>
                  <p>
                    External applications use API keys to authenticate requests
                    to the ScamGuard API.
                  </p>
                  <h4 className="font-medium mt-4">Generating API Keys:</h4>
                  <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300">
                    <li>Log in to the ScamGuard dashboard</li>
                    <li>Navigate to API Settings</li>
                    <li>Click "Generate New API Key"</li>
                    <li>
                      Add a description for the key (e.g., "Production API Key")
                    </li>
                    <li>Set permissions and rate limits</li>
                    <li>
                      Store the generated key securely - it will only be shown
                      once
                    </li>
                  </ol>
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-4">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                      Security Warning
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Never share your API keys or include them in client-side
                      code. Always store keys securely and use environment
                      variables or secure vaults to manage them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "workflow" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Workflow
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">
                  The ScamGuard platform follows a specific workflow for report
                  submission, verification, and resolution.
                </p>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    Report Submission
                  </h3>
                  <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300">
                    <li>User connects wallet to ScamGuard</li>
                    <li>User creates a new report with required details</li>
                    <li>
                      User stakes SUI tokens alongside their report (minimum 1
                      SUI)
                    </li>
                    <li>
                      Report is submitted to the blockchain and enters "pending"
                      status
                    </li>
                    <li>Verification period begins (default: 72 hours)</li>
                  </ol>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    Verification Process
                  </h3>
                  <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300">
                    <li>Community members review pending reports</li>
                    <li>
                      Verifiers stake tokens to vote "verify" or "reject" on the
                      report
                    </li>
                    <li>
                      Each vote is recorded on-chain with an optional comment
                    </li>
                    <li>Voting continues until verification deadline</li>
                    <li>Report status is determined by majority vote</li>
                  </ol>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    Resolution and Rewards
                  </h3>
                  <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300">
                    <li>
                      After deadline, report is marked as "verified" or
                      "rejected"
                    </li>
                    <li>
                      If verified, reporter and majority verifiers split rewards
                    </li>
                    <li>If rejected, minority verifiers lose their stake</li>
                    <li>
                      Verified reports are added to the ScamGuard database
                    </li>
                    <li>Reporter and verifiers receive reputation points</li>
                  </ol>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">
                    Risk Assessment Algorithm
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Reports are automatically assigned a risk level (low,
                    medium, high, critical) based on several factors:
                  </p>
                  <ul className="list-disc pl-5 text-blue-700 dark:text-blue-300">
                    <li>Scam type severity</li>
                    <li>Number of affected users (if known)</li>
                    <li>Estimated financial impact</li>
                    <li>Similarity to previously verified scams</li>
                    <li>Verifier consensus score</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === "integration" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Integration Guide
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">
                  This guide provides step-by-step instructions for integrating
                  ScamGuard into your application.
                </p>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    1. Set Up API Access
                  </h3>
                  <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300">
                    <li>Register an account on ScamGuard</li>
                    <li>Generate an API key in the dashboard</li>
                    <li>Store your API key securely</li>
                  </ol>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    2. Address Verification Integration
                  </h3>
                  <p className="mb-2">
                    Add address verification to your application:
                  </p>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 overflow-auto">
                    <pre>{`// Example JavaScript code
async function checkAddress(address) {
  const response = await fetch('https://api.scamguard.sui/api/v1/check-address/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({ address })
  });
  
  const data = await response.json();
  return data;
}

// Usage
const result = await checkAddress('0x123...abc');
if (result.is_scam) {
  showWarning(\`Risk Level: \${result.risk_level}\`);
}
`}</pre>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    3. Widget Integration
                  </h3>
                  <p className="mb-2">
                    Add the ScamGuard widget to your application:
                  </p>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 overflow-auto">
                    <pre>{`<!-- HTML Widget -->
<script src="https://widget.scamguard.sui/v1/widget.js" 
  data-api-key="YOUR_API_KEY"
  data-theme="light">
</script>

<!-- Add the widget container anywhere in your app -->
<div id="scamguard-widget"></div>
`}</pre>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    4. Webhook Integration
                  </h3>
                  <p className="mb-2">
                    Set up webhooks to receive real-time updates:
                  </p>
                  <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300">
                    <li>Go to API Settings in your ScamGuard dashboard</li>
                    <li>Add a webhook URL for your application</li>
                    <li>Select the events you want to monitor</li>
                    <li>Set up a webhook handler in your application</li>
                  </ol>
                  <div className="bg-gray-800 p-3 rounded-md text-gray-100 mb-3 overflow-auto">
                    <pre>{`// Example webhook handler in Express.js
app.post('/scamguard-webhook', (req, res) => {
  const { event, data, timestamp, signature } = req.body;
  
  // Verify webhook signature
  if (!verifySignature(req.body, signature, webhookSecret)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Handle different event types
  switch (event) {
    case 'report.verified':
      // Update your database or alert system
      break;
    case 'report.rejected':
      // Handle rejected reports
      break;
    // ...other events
  }
  
  res.status(200).send('Webhook received');
});
`}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "bestPractices" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Best Practices
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    Report Submission
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>
                      Include as much evidence as possible (screenshots, links,
                      transaction hashes)
                    </li>
                    <li>Be specific about the scam type and techniques used</li>
                    <li>Provide clear steps to reproduce or verify the scam</li>
                    <li>
                      Stake an appropriate amount based on your confidence level
                    </li>
                    <li>Respond to questions from verifiers in the comments</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    Verification Process
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>Review all evidence thoroughly before voting</li>
                    <li>
                      Research the reported address and any associated
                      transactions
                    </li>
                    <li>Check for similar reports in the database</li>
                    <li>Provide a detailed explanation for your vote</li>
                    <li>Consider the reputation of the reporter</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">API Integration</h3>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>Implement rate limiting in your application</li>
                    <li>Cache frequently accessed data to reduce API calls</li>
                    <li>Handle API errors gracefully with proper fallbacks</li>
                    <li>Keep your API key secure and rotate it regularly</li>
                    <li>Set up monitoring for API usage and errors</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="font-medium text-lg mb-2">
                    Security Considerations
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                    <li>Never share API keys in client-side code</li>
                    <li>Validate all data before submitting to the API</li>
                    <li>Use HTTPS for all API communications</li>
                    <li>Implement webhook signature verification</li>
                    <li>Set appropriate permissions for API keys</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
                    Common Pitfalls
                  </h3>
                  <ul className="list-disc pl-5 text-yellow-700 dark:text-yellow-300">
                    <li>Submitting reports with insufficient evidence</li>
                    <li>Voting based on insufficient research</li>
                    <li>
                      Using production API keys in development environments
                    </li>
                    <li>Not handling rate limits appropriately</li>
                    <li>Ignoring webhook validation</li>
                    <li>Staking too little for high-confidence reports</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
