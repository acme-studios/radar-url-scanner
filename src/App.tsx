import { Scanner } from './components/Scanner.tsx'

function App() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-100 overflow-hidden">
      {/* Compact Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/logo.png" alt="RadarScan Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  Radar<span className="text-[#F6821F]">Scan</span>
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">Scan URLs with Cloudflare Radar • Get instant PDF reports</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Flex grow to fill remaining space */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
        <Scanner />
      </main>
    </div>
  )
}

export default App
