"use client";
import React, { useState } from "react";
import {
  Github,
  Container,
  CheckCircle,
  AlertCircle,
  Play,
  Download,
  Copy,
  Eye,
  EyeOff,
  Database,
  Code,
  Settings,
  Package,
  FileText,
  ArrowRight,
  ExternalLink,
  Layers,
  Zap,
  Shield
} from "lucide-react";

const ContainerizationTool = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("dockerfile");
  const [processingStep, setProcessingStep] = useState(0);
  const [readmeGenerated, setReadmeGenerated] = useState(false);

  const processingSteps = [
    "Cloning repository...",
    "Analyzing code structure...",
    "Detecting tech stack...",
    "Generating Dockerfile...",
    "Creating configuration files...",
    "Analyzing dependencies...",
    "Generating README with LLM...",
    "Storing in database...",
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

  const handleProcess = async () => {
    if (!validateGitHubUrl(repoUrl)) return;
    setIsProcessing(true);
    setProcessingStep(0);
    setShowResults(false);
    setReadmeGenerated(false);
    
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i);
      if (i === 6) setReadmeGenerated(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setIsProcessing(false);
    setShowResults(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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

  const mockDockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]`;

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

  const mockDependencies = {
    "runtime": ["react@18.2.0", "express@4.18.2", "lodash@4.17.21"],
    "development": ["webpack@5.88.0", "babel@7.22.0", "jest@29.5.0"],
    "security": ["0 vulnerabilities found", "All dependencies up to date"],
    "techStack": ["Node.js", "React", "Express.js", "JavaScript"]
  };

  const mockReadme = `# My Awesome Project

## Overview
This is a modern Node.js application built with React and Express.js. The application provides a robust web interface with server-side rendering capabilities.

## Features
- Modern React frontend
- Express.js backend API
- Real-time data processing
- Responsive design
- Security-first approach

## Installation
\`\`\`bash
npm install
npm start
\`\`\`

## API Endpoints
- GET /api/health - Health check
- GET /api/data - Fetch application data
- POST /api/users - Create new user

## Contributing
Please read CONTRIBUTING.md for contribution guidelines.

## License
MIT License - see LICENSE file for details.`;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header Section */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-blue-500">
              <Container className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">DockZen</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your GitHub repositories into production-ready containers with AI-powered analysis and README generation
          </p>
        </header>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Code className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold">Smart Code Analysis</h3>
            </div>
            <p className="text-gray-400">
              Deep dive into your codebase to understand structure, dependencies, and optimal containerization strategy
            </p>
          </div>
          <div className="bg-gray-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold">AI-Powered Documentation</h3>
            </div>
            <p className="text-gray-400">
              Generate comprehensive README files using LLM analysis, stored in database for future access
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-gray-900 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Github className="h-6 w-6 text-white" />
            <h2 className="text-2xl font-bold">Repository Analysis</h2>
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
                  placeholder="https://github.com/yourname/yourproject"
                  className={`w-full px-4 py-3 bg-black border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 ${!isValidUrl ? "border-red-500" : "border-gray-700"}`}
                />
                {repoUrl && (
                  <div className="absolute right-3 top-3">
                    {isValidUrl ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" />
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
            <div className="flex gap-4">
              <button
                onClick={handleProcess}
                disabled={!repoUrl || !isValidUrl || isProcessing}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Play className="h-5 w-5" />
                )}
                {isProcessing ? "Analyzing..." : "Start Analysis"}
              </button>
            </div>
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-gray-900 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <h3 className="text-lg font-semibold">Processing Repository...</h3>
            </div>
            <div className="space-y-2">
              {processingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index === processingStep
                      ? "bg-blue-500 bg-opacity-20 text-blue-300"
                      : index < processingStep
                      ? "bg-green-500 bg-opacity-20 text-green-300"
                      : "text-gray-500"
                  }`}
                >
                  {index < processingStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : index === processingStep ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-600"></div>
                  )}
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section - Vertical Layout */}
        {showResults && (
          <div className="space-y-8">
            
            {/* Section 1: Dockerfile Generation */}
            <div className="bg-gray-900 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Container className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold">Dockerfile Generation</h2>
              </div>
              <div className="bg-black p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Generated Dockerfile</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(mockDockerfile)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadFile("Dockerfile", mockDockerfile)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-white text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
                <pre className="text-gray-300 text-sm overflow-x-auto">
                  <code>{mockDockerfile}</code>
                </pre>
              </div>
            </div>

            {/* Section 2: Configuration Files */}
            <div className="bg-gray-900 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold">Configuration Files</h2>
              </div>
              <div className="bg-black p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Container Configuration</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(mockConfig)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadFile("container-config.json", mockConfig)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-white text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
                <pre className="text-gray-300 text-sm overflow-x-auto">
                  <code>{mockConfig}</code>
                </pre>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-black p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Port Configuration</h4>
                  <p className="text-gray-300">Exposed: 3000</p>
                  <p className="text-gray-300">Protocol: HTTP</p>
                </div>
                <div className="bg-black p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Environment</h4>
                  <p className="text-gray-300">NODE_ENV: production</p>
                  <p className="text-gray-300">PORT: 3000</p>
                </div>
              </div>
            </div>

            {/* Section 3: Dependency Analysis */}
            <div className="bg-gray-900 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-yellow-400" />
                <h2 className="text-2xl font-bold">Dependency Analysis</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black p-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Tech Stack Detected</h3>
                  <div className="space-y-2">
                    {mockDependencies.techStack.map((tech, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-300">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-black p-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Security Analysis</h3>
                  <div className="space-y-2">
                    {mockDependencies.security.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-black p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Dependencies Overview</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-400 mb-2">Runtime Dependencies</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      {mockDependencies.runtime.map((dep, index) => (
                        <li key={index}>• {dep}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-400 mb-2">Development Dependencies</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      {mockDependencies.development.map((dep, index) => (
                        <li key={index}>• {dep}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: README Creation with Database Connection */}
            <div className="bg-gray-900 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-purple-400" />
                <h2 className="text-2xl font-bold">AI-Generated README</h2>
                {readmeGenerated && (
                  <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-sm">
                    <Database className="h-4 w-4" />
                    Stored in Database
                  </div>
                )}
              </div>
              
              <div className="bg-blue-500 bg-opacity-10 rounded-lg p-4 border border-blue-500 border-opacity-30 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="h-5 w-5 text-blue-400" />
                  <h3 className="font-semibold text-blue-400">LLM Database Integration</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  README generated using advanced language models and automatically stored in our database for version control and future access.
                </p>
              </div>

              <div className="bg-black p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Generated README.md</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(mockReadme)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadFile("README.md", mockReadme)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-white text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
                <pre className="text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
                  <code>{mockReadme}</code>
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-900 p-8">
              <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3">
                  <ExternalLink className="h-5 w-5" />
                  Deploy to Cloud
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3">
                  <Play className="h-5 w-5" />
                  Test Locally
                </button>
              </div>
              
              {/* Interactive Button to Details Page */}
              <button 
                onClick={() => window.open('/details', '_blank')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3"
              >
                <Layers className="h-5 w-5" />
                Dive into the Details
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="text-center text-gray-400 text-sm mt-2">
                Explore comprehensive analysis, database insights, and advanced configuration options
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContainerizationTool;