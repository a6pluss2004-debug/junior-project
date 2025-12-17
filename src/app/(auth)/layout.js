export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#3d348b] via-[#5b4fa3] to-[#1a1640]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#78e0dc] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-[#ff8d4c] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-[#78e0dc] rounded-full mix-blend-screen filter blur-[100px] opacity-25 animate-float-delayed"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
