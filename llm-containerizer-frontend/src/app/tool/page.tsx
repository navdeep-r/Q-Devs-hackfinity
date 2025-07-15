"use client";
import React, { useState } from "react";
import AuthSection from "../../components/AuthSection";
import {
  Github,
  Container,
  Zap,
  CheckCircle,
  AlertCircle,
  Play,
  Download,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

const ContainerizationTool = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("dockerfile");
  const [showLogs, setShowLogs] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [dockerfileContent, setDockerfileContent] = useState("");
  const [configContent, setConfigContent] = useState("");
  const [logsContent, setLogsContent] = useState("");

  const processingSteps = [
    "Cloning repository...",
    "Analyzing code structure...",
    "Detecting tech stack...",
    "Generating Dockerfile...",
    "Creating configuration files...",
    "Validating container setup...",
    "Complete!",
  ];

  const validateGitHubUrl = (url: string) => {
    const githubRegex = /^https:\/\/github\.com\/[\w\-.]+\/[\w\-.]+\/?$/;
    return githubRegex.test(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setRepoUrl(url);
    if (url) {
      setIsValidUrl(validateGitHubUrl(url));
    } else {
      setIsValidUrl(true);
    }
  };

  // const handleProcess = async () => {
  //   if (!validateGitHubUrl(repoUrl)) return;

  //   setIsProcessing(true);
  //   setProcessingStep(0);
  //   setShowResults(false);

  //   try {
  //     // Call your backend API to clone the repo
  //     const response = await fetch("http://localhost:5000/api/repos/clone", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ repoUrl }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to clone repository");
  //     }

  //     const data = await response.json();
  //     console.log("Clone success:", data);

  //     // Simulate step progress (or adapt as needed)
  //     for (let i = 0; i < processingSteps.length; i++) {
  //       setProcessingStep(i);
  //       await new Promise((resolve) => setTimeout(resolve, 800));
  //     }

  //     setIsProcessing(false);
  //     setShowResults(true);
  //   } catch (error) {
  //     console.error(error);
  //     alert("An error occurred while cloning the repository.");
  //     setIsProcessing(false);
  //   }
  // };

  const handleProcess = async () => {
    if (!validateGitHubUrl(repoUrl)) return;
    setIsProcessing(true);
    setProcessingStep(0);
    setShowResults(false);

    try {
      setProcessingStep(0); // Cloning
      const response = await fetch("http://localhost:5000/api/repos/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        throw new Error(
          "Server error while cloning and analyzing the repository."
        );
      }

      const data = await response.json();

      // You can customize these
      setProcessingStep(processingSteps.length - 1); // Complete

      // Store analysis results in state
      setDockerfileContent(data.analysis.dockerfile || "");
      setConfigContent(data.analysis.config || "");
      setLogsContent(data.analysis.logs || "");

      setShowResults(true);
    } catch (err) {
      console.error(err);
      alert("Failed to process repository. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  //

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const mockDockerfile = `FROM node:18-alpine\n\nWORKDIR /app\n\nCOPY package*.json ./\nRUN npm ci --only=production\n\nCOPY . .\n\nEXPOSE 3000\n\nUSER node\n\nCMD ["npm", "start"]`;

  const mockConfig = `{
  "name": "my-app-container",
  "ports": ["3000:3000"],
  "environment": {
    "NODE_ENV": "production",
    "PORT": "3000"
  },
  "healthcheck": {
    "test": ["CMD", "curl", "-f", "http://localhost:3000/health"],
    "interval": "30s",
    "timeout": "10s",
    "retries": 3
  },
  "restart": "unless-stopped"
}`;

  const mockLogs = `[INFO] 2024-01-15 10:30:45 - Repository cloned successfully
[INFO] 2024-01-15 10:30:46 - Detected Node.js project with Express.js framework
[INFO] 2024-01-15 10:30:47 - Found package.json with 15 dependencies
[INFO] 2024-01-15 10:30:48 - Analyzing entry point: src/index.js
[INFO] 2024-01-15 10:30:49 - Detected port configuration: 3000
[INFO] 2024-01-15 10:30:50 - Analyzing build requirements
[INFO] 2024-01-15 10:30:51 - Dockerfile generated with Node.js 18 Alpine base
[INFO] 2024-01-15 10:30:52 - Configuration includes health checks
[INFO] 2024-01-15 10:30:53 - Security scan completed - no vulnerabilities found
[SUCCESS] 2024-01-15 10:30:54 - Container setup validated successfully
[INFO] 2024-01-15 10:30:55 - Ready for deployment!`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* SVG background overlay */}
      <div
        className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 pointer-events-none`}
      ></div>
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <AuthSection />
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-purple-600 rounded-2xl">
              <Container
                className="h-8 w-8 text-white"
                aria-label="Container Icon"
              />
            </div>
            <h1 className="text-4xl font-bold text-white">
              AI Repository Containerizer
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform any GitHub repository into a production-ready Docker
            container with the power of AI. Automated analysis, intelligent
            Dockerfile generation, and seamless containerization.
          </p>
        </header>
        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Github
                className="h-6 w-6 text-blue-400"
                aria-label="GitHub Icon"
              />
              <h3 className="text-lg font-semibold text-white">
                Smart Analysis
              </h3>
            </div>
            <p className="text-gray-300">
              AI-powered code analysis detects tech stacks, dependencies, and
              optimal containerization strategies.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-yellow-400" aria-label="Zap Icon" />
              <h3 className="text-lg font-semibold text-white">
                Instant Generation
              </h3>
            </div>
            <p className="text-gray-300">
              Generate production-ready Dockerfiles and configuration files in
              seconds, not hours.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle
                className="h-6 w-6 text-green-400"
                aria-label="Check Icon"
              />
              <h3 className="text-lg font-semibold text-white">Validation</h3>
            </div>
            <p className="text-gray-300">
              Automated testing and health checks ensure your containers are
              ready for deployment.
            </p>
          </div>
        </div>
        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Github className="h-6 w-6 text-white" aria-label="GitHub Icon" />
            <h2 className="text-2xl font-bold text-white">Repository Input</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GitHub Repository URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={repoUrl}
                  onChange={handleUrlChange}
                  placeholder="https://github.com/username/repository"
                  className={`w-full px-4 py-3 bg-slate-800 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    !isValidUrl ? "border-red-500" : "border-slate-700"
                  }`}
                  aria-label="GitHub Repository URL"
                />
                {repoUrl && (
                  <div className="absolute right-3 top-3">
                    {isValidUrl ? (
                      <CheckCircle
                        className="h-5 w-5 text-green-400"
                        aria-label="Valid URL"
                      />
                    ) : (
                      <AlertCircle
                        className="h-5 w-5 text-red-400"
                        aria-label="Invalid URL"
                      />
                    )}
                  </div>
                )}
              </div>
              {!isValidUrl && (
                <p className="text-red-400 text-sm mt-1">
                  Please enter a valid GitHub repository URL
                </p>
              )}
            </div>
            <button
              onClick={handleProcess}
              disabled={!repoUrl || !isValidUrl || isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
              aria-label="Containerize Repository"
            >
              {isProcessing ? (
                <div
                  className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                  aria-label="Processing Spinner"
                ></div>
              ) : (
                <Play className="h-5 w-5" aria-label="Play Icon" />
              )}
              {isProcessing ? "Processing..." : "Containerize Repository"}
            </button>
            {/* Demo Button */}
            <button
              onClick={() => {
                setRepoUrl("https://github.com/example/demo-app");
                setIsValidUrl(true);
                setShowResults(true);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 mt-2"
              aria-label="View Demo Results"
              disabled={isProcessing}
            >
              <Eye className="h-5 w-5" aria-label="Eye Icon" />
              View Demo Results
            </button>
          </div>
        </div>
        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"
                aria-label="Processing Spinner"
              ></div>
              <h3 className="text-lg font-semibold text-white">
                Processing Repository
              </h3>
            </div>
            <div className="space-y-2">
              {processingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    index === processingStep
                      ? "bg-purple-600/20 text-purple-300"
                      : index < processingStep
                      ? "bg-green-600/20 text-green-300"
                      : "text-gray-500"
                  }`}
                >
                  {index < processingStep ? (
                    <CheckCircle
                      className="h-4 w-4"
                      aria-label="Step Complete"
                    />
                  ) : index === processingStep ? (
                    <div
                      className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"
                      aria-label="Current Step Spinner"
                    ></div>
                  ) : (
                    <div
                      className="h-4 w-4 rounded-full border-2 border-gray-600"
                      aria-label="Pending Step"
                    ></div>
                  )}
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Results Section */}
        {showResults && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Generated Files</h2>
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                aria-label={showLogs ? "Hide Logs" : "Show Logs"}
              >
                {showLogs ? (
                  <EyeOff className="h-4 w-4" aria-label="Hide Logs Icon" />
                ) : (
                  <Eye className="h-4 w-4" aria-label="Show Logs Icon" />
                )}
                {showLogs ? "Hide" : "Show"} Logs
              </button>
            </div>
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-slate-800 rounded-lg p-1">
              {[
                { id: "dockerfile", label: "Dockerfile" },
                { id: "config", label: "Configuration" },
                { id: "logs", label: "Analysis Logs" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-slate-700"
                  }`}
                  aria-label={tab.label}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === "dockerfile" && (
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      Dockerfile
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            dockerfileContent || "No Dockerfile generated."
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors"
                        aria-label="Copy Dockerfile"
                      >
                        <Copy className="h-4 w-4" aria-label="Copy Icon" />
                        Copy
                      </button>
                      <button
                        onClick={() =>
                          downloadFile(
                            "Dockerfile",
                            dockerfileContent || "No Dockerfile generated."
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors"
                        aria-label="Download Dockerfile"
                      >
                        <Download
                          className="h-4 w-4"
                          aria-label="Download Icon"
                        />
                        Download
                      </button>
                    </div>
                  </div>
                  <pre className="text-gray-300 text-sm overflow-x-auto">
                    <code>
                      {dockerfileContent || "No Dockerfile generated."}
                    </code>
                  </pre>
                </div>
              )}
              {activeTab === "config" && (
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      Container Configuration
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            configContent || "No configuration generated."
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors"
                        aria-label="Copy Config"
                      >
                        <Copy className="h-4 w-4" aria-label="Copy Icon" />
                        Copy
                      </button>
                      <button
                        onClick={() =>
                          downloadFile(
                            "container-config.json",
                            configContent || "No configuration generated."
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors"
                        aria-label="Download Config"
                      >
                        <Download
                          className="h-4 w-4"
                          aria-label="Download Icon"
                        />
                        Download
                      </button>
                    </div>
                  </div>
                  <pre className="text-gray-300 text-sm overflow-x-auto">
                    <code>
                      {configContent || "No configuration generated."}
                    </code>
                  </pre>
                </div>
              )}
              {activeTab === "logs" && (
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Analysis Logs
                  </h3>
                  <pre className="text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
                    <code>{logsContent || "No logs available."}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                aria-label="Deploy Container"
              >
                Deploy Container
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                aria-label="Test Locally"
              >
                Test Locally
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Page() {
  return <ContainerizationTool />;
}
