"use client";

import { useMemo, useState } from "react";
import { ethers } from "ethers";

type Result = {
  input: string;
  ensName: string | null;
  address: string | null;
  avatarUrl: string | null;
  error: string | null;
};

export default function EnsLookup() {
  const provider = useMemo(() => {
    return new ethers.JsonRpcProvider("https://ethereum.publicnode.com");
  }, []);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function lookup() {
    const input = text.trim();
    if (!input) return;

    setLoading(true);
    setResult(null);

    try {
      let ensName: string | null = null;
      let address: string | null = null;
      let avatarUrl: string | null = null;

      if (ethers.isAddress(input)) {
        address = ethers.getAddress(input);
        ensName = await provider.lookupAddress(address);

        if (ensName) {
          const resolver = await provider.getResolver(ensName);
          avatarUrl = resolver ? await resolver.getAvatar() : null;
        }
      } else {
        ensName = input;
        address = await provider.resolveName(ensName);

        const resolver = await provider.getResolver(ensName);
        avatarUrl = resolver ? await resolver.getAvatar() : null;
      }

      setResult({ input, ensName, address, avatarUrl, error: null });
    } catch (e: any) {
      setResult({
        input,
        ensName: null,
        address: null,
        avatarUrl: null,
        error: e?.message ?? "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      lookup();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/40 rounded-full animate-float-up" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float-up-delayed" />
        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-indigo-400/40 rounded-full animate-float-up-slow" />
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-blue-300/40 rounded-full animate-float-up" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">ENS Lookup</h1>
          <p className="text-slate-500 text-sm">
            Recherchez un nom ENS ou une adresse Ethereum
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6 mb-4">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="vitalik.eth ou 0x..."
              className="flex-1 px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
            <button
              onClick={lookup}
              disabled={loading || !text.trim()}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all active:scale-95 disabled:active:scale-100"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6 animate-fade-in">
            {result.error ? (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900 mb-1">Erreur</p>
                  <p className="text-sm text-red-600">{result.error}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Avatar & Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {result.avatarUrl ? (
                      <img
                        src={result.avatarUrl}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-8 h-8 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                      Profil trouvé
                    </p>
                    <p className="text-lg font-semibold text-slate-900 truncate">
                      {result.ensName || "Aucun ENS"}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {result.ensName && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">
                        Nom ENS
                      </p>
                      <p className="text-sm text-slate-900 font-mono bg-slate-50 px-3 py-2 rounded-lg">
                        {result.ensName}
                      </p>
                    </div>
                  )}
                  {result.address && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">
                        Adresse
                      </p>
                      <p className="text-sm text-slate-900 font-mono bg-slate-50 px-3 py-2 rounded-lg break-all">
                        {result.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-40px, 30px) scale(0.9);
          }
          66% {
            transform: translate(30px, -20px) scale(1.1);
          }
        }

        @keyframes float-up {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }

        .animate-float-up {
          animation: float-up 15s linear infinite;
        }

        .animate-float-up-delayed {
          animation: float-up 18s linear infinite 3s;
        }

        .animate-float-up-slow {
          animation: float-up 22s linear infinite 5s;
        }
      `}</style>
    </div>
  );
}