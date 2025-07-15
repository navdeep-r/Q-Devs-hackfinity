"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Github, 
  Container, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  ArrowRight,
  Star,
  Trophy,
  Lightbulb,
  Brain,
  Coffee,
  Skull,
  Heart,
  Sparkles
} from 'lucide-react';

const ContainerizationLanding = () => {
  const router = useRouter();
  const [currentOneLiner, setCurrentOneLiner] = useState(0);
  const [aiThought, setAiThought] = useState('');
  const [showBadge, setShowBadge] = useState(false);
  const [fortuneCookie, setFortuneCookie] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const oneLiners = [
    "Running npm install and praying it works... 🙏",
    "Python project, but no requirements.txt? We'll survive. 💪",
    "Another day, another Docker layer that doesn't make sense... 🐳",
    "When your app works locally but breaks in production... 😭",
    "Me: 'It works on my machine' Docker: 'Hold my beer' 🍺"
  ];

  const devConfessions = [
    {
      text: "TOLD A DEV TO BUILD THE TVK APP..Then when i went to read the codebase i was like 'ahhh..hell na'",
      author: "THALAPATHY VIJAY",
      avatar: "👩‍💻"
    },
    {
      text: "I can ACT like a god,race like a god but while reading the opensource codebase it makes me throw up a lot",
      author: "THALA AJITH",
      avatar: "🧔‍♂️"
    },
    {
      text: "Gonna cook up is what i thought but the broken readme cooked me hell a lot.",
      author: "POWER STAR",
      avatar: "🥷"
    }
  ];

  const fortuneCookies = [
    "May your builds never break, and your ports always be exposed. 🔮",
    "Your containers shall be light, your images optimized, and your deployments swift. ⚡",
    "The Docker gods smile upon your multi-stage builds. 😇",
    "In containerization we trust, in AI we believe. 🤖"
  ];

  const aiThoughts = [
    "Hmm, detecting project structure... 🤔",
    "Found package.json - Node.js project detected! 📦",
    "Analyzing dependencies... this might take a sec ⏳",
    "Generating optimized Dockerfile... ✨",
    "Adding security best practices... 🔒",
    "Dockerfile generated successfully! 🎉"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOneLiner((prev) => (prev + 1) % oneLiners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true);
    let thoughtIndex = 0;
    setAiThought(aiThoughts[0]);
    const thinkingInterval = setInterval(() => {
      if (thoughtIndex < aiThoughts.length) {
        setAiThought(aiThoughts[thoughtIndex]);
        thoughtIndex++;
      } else {
        clearInterval(thinkingInterval);
        setIsAnalyzing(false);
        setShowBadge(true);
        setFortuneCookie(fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)]);
        setTimeout(() => setShowBadge(false), 3000);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%231DA1F2" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>
      {/* Floating Elements */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Conversational Hero Section */}
        <header className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              Got a repo but no idea<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DA1F2] to-[#0a85d9]">
                NO WORRIES Q-DEVS GOTCH UR BACK
              </span>
            </h1>
            <p className="text-lg text-[#AAB8C2] max-w-2xl mx-auto">
              Forget README.md. Let our AI read your repo like a dev who actually knows what they're doing.
            </p>
          </div>
          {/* One-liner Generator */}
          <div className="bg-[#1DA1F2]/10 backdrop-blur-sm rounded-none p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Coffee className="h-5 w-5 text-[#1DA1F2]" />
              <span className="text-sm text-[#AAB8C2]">Currently in dev mode...</span>
            </div>
            <p className="text-xl text-white font-mono transition-all duration-500 ease-in-out">
              {oneLiners[currentOneLiner]}
            </p>
          </div>
        </header>
        {/* Visual Cue Moments - AI Bot Animation */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="bg-[#1DA1F2]/10 backdrop-blur-sm rounded-none p-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="text-6xl">🤖</div>
                  {isAnalyzing && (
                    <div className="absolute -top-2 -right-2">
                      <div className="animate-spin rounded-none h-6 w-6 border-b-2 border-[#1DA1F2]"></div>
                    </div>
                  )}
                </div>
                <div className="text-4xl">→</div>
                <div className="text-6xl">📁</div>
                <div className="text-4xl">→</div>
                <div className="relative">
                  <div className="text-6xl">💡</div>
                  {!isAnalyzing && (
                    <div className="absolute -top-1 -right-1 animate-pulse">
                      <Sparkles className="h-8 w-8 text-[#1DA1F2]" />
                    </div>
                  )}
                </div>
                <div className="text-4xl">→</div>
                <div className="text-6xl">🐳</div>
              </div>
            </div>
            {/* AI Thought Bubble */}
            {aiThought && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white text-black rounded-none p-4 shadow-xl animate-fade-in">
                <div className="text-sm font-medium">{aiThought}</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Before/After Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#1DA1F2]/10 backdrop-blur-sm rounded-none p-8">
            <div className="flex items-center gap-3 mb-6">
              <Skull className="h-6 w-6 text-[#1DA1F2]" />
              <h3 className="text-2xl font-bold text-white">Before 😭</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#AAB8C2]">
                <span className="text-xl">1️⃣</span>
                <span>Clone repo</span>
              </div>
              <div className="flex items-center gap-3 text-[#AAB8C2]">
                <span className="text-xl">2️⃣</span>
                <span>Read the codebase for hours trying to decrypt it</span>
              </div>
              <div className="flex items-center gap-3 text-[#AAB8C2]">
                <span className="text-xl">3️⃣</span>
                <span>Figuring it how to go about rquired changes</span>
              </div>
              <div className="flex items-center gap-3 text-[#AAB8C2]">
                <span className="text-xl">4️⃣</span>
                <span>Debug for hours?....DAYS!!!</span>
              </div>
              <div className="flex items-center gap-3 text-[#AAB8C2]">
                <span className="text-xl">5️⃣</span>
                <span>Trying to containerize it </span>
              </div>
              <div className="flex items-center gap-3 text-[#AAB8C2]">
                <span className="text-xl">6️⃣</span>
                <span>sad ur lifespan is already over</span>
              </div>
            </div>
          </div>
          <div className="bg-[#1DA1F2]/10 backdrop-blur-sm rounded-none p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-[#1DA1F2]" />
              <h3 className="text-2xl font-bold text-white">After 🎉</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#AAB8C2]">
                <span className="text-xl">1️⃣</span>
                <span>Paste URL</span>
              </div>
              <div className="flex items-center gap-3 text-[#AAB8C2]">
                <span className="text-xl">2️⃣</span>
                <span>Hit Generate</span>
              </div>
              <div className="flex items-center gap-3 text-[#AAB8C2]">
                <span className="text-xl">3️⃣</span>
                <span>Done!Only hard work left is to work on changes!!</span>
              </div>
              <div className="flex items-center gap-3 text-[#1DA1F2] font-semibold">
                <span className="text-xl">✨</span>
                <span>NOW Go get coffee instead</span>
              </div>
            </div>
          </div>
        </div>
        {/* Dev Confession Box */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Dev Confessions 💭
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {devConfessions.map((confession, index) => (
              <div key={index} className="bg-[#1DA1F2]/10 backdrop-blur-sm rounded-none p-6 hover:bg-[#1DA1F2]/15 transition-all duration-300">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">{confession.avatar}</span>
                  <div>
                    <div className="font-semibold text-white">@{confession.author}</div>
                  </div>
                </div>
                <p className="text-[#AAB8C2] italic">"{confession.text}"</p>
              </div>
            ))}
          </div>
        </div>
        {/* Funny Edge Case */}
        
        {/* Main CTA - Interactive Button to page.jsx */}
        <div className="text-center">
          <div className="bg-black rounded-none p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Containerize Like a Pro? 🎯
            </h2>
            <p className="text-[#AAB8C2] mb-8 max-w-2xl mx-auto">
              We don't judge your spaghetti code. We dockerize it. Experience the full power of AI-driven containerization.
            </p>
            <button
              onClick={() => router.push("/tool")}
              className="group bg-gradient-to-r from-[#1DA1F2] to-[#0a85d9] hover:from-[#0a85d9] hover:to-[#1DA1F2] text-white font-bold py-6 px-12 rounded-none transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-4 mx-auto"
            >
              <Container className="h-8 w-8 group-hover:animate-pulse" />
              <span className="text-2xl">LET US COOK!</span>
              <ArrowRight className="h-8 w-8 group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="text-sm text-[#AAB8C2] mt-4">
             CLICK ABOVE to the complete containerization tool with advanced features, 
              real-time processing, and comprehensive repository analysis.
            </p>
          </div>
        </div>
        {/* Footer */}
        <footer className="text-center mt-16 text-[#AAB8C2]">
          <p>Built with ❤️ for developers who hate writing Dockerfiles</p>
        </footer>
      </div>
    </div>
  );
};

export default ContainerizationLanding;
