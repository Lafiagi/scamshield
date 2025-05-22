import {
  AlertCircle,
  Wallet,
  DollarSign,
  ExternalLink,
  Shield,
} from "lucide-react";

// Optional mapping of scam type to icon component
const scamTypeIcons = {
  impersonation: <AlertCircle className="h-4 w-4 text-blue-500 mr-2" />,
  wallet: <Wallet className="h-4 w-4 text-blue-500 mr-2" />,
  airdrop: <DollarSign className="h-4 w-4 text-blue-500 mr-2" />,
  phishing: <ExternalLink className="h-4 w-4 text-blue-500 mr-2" />,
  default: <Shield className="h-4 w-4 text-blue-500 mr-2" />,
};

// Optional label formatter
const formatScamType = (type) => {
  const labels = {
    impersonation: "Impersonation",
    wallet: "Wallet Scam",
    airdrop: "Fake Airdrop",
    phishing: "Phishing",
    fake_token: "Fake Token",
    social_media: "Social Media Scam",
    website: "Website Scam",
    smart_contract: "Malicious Contract",
    other: "Other",
  };
  return labels[type] || type;
};

export default function TopScamTypes({ stats }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-medium mb-3">Top Scam Types</h2>
      <div className="space-y-3">
        {stats?.map((item) => (
          <div key={item.type}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {scamTypeIcons[item.type] || scamTypeIcons.default}
                <span className="text-sm">{formatScamType(item.type)}</span>
              </div>
              <span className="text-sm font-medium">{item.percentage}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
