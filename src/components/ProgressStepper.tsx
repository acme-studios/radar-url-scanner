type ScanStatus = 'idle' | 'queued' | 'scanning' | 'generating' | 'uploading' | 'completed' | 'failed' | 'expired'

interface ProgressStepperProps {
  status: ScanStatus
  error?: string
}

const steps = [
  { key: 'queued', label: 'Queued', icon: '📋' },
  { key: 'scanning', label: 'Scanning', icon: '🔍' },
  { key: 'generating', label: 'Generating', icon: '📄' },
  { key: 'uploading', label: 'Uploading', icon: '☁️' },
  { key: 'completed', label: 'Complete', icon: '✓' },
]

export function ProgressStepper({ status, error }: ProgressStepperProps) {
  const currentIndex = steps.findIndex(step => step.key === status)
  const progress = ((currentIndex + 1) / steps.length) * 100
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 animate-fade-in max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#F6821F] to-[#FF9A3C] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex || (status === 'completed' && step.key === 'completed')
            const isCurrent = index === currentIndex && status !== 'completed'
            
            return (
              <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                <div className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base
                  transition-all duration-300 border-2
                  ${isCompleted ? 'bg-[#F6821F] border-[#F6821F] text-white scale-110' : ''}
                  ${isCurrent ? 'bg-white border-[#F6821F] text-[#F6821F] animate-pulse-orange' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                `}>
                  {isCompleted ? '✓' : step.icon}
                </div>
                <span className={`
                  text-xs sm:text-sm font-medium text-center
                  ${isCurrent ? 'text-[#F6821F]' : ''}
                  ${isCompleted ? 'text-gray-700' : ''}
                  ${!isCompleted && !isCurrent ? 'text-gray-400' : ''}
                `}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Current Status */}
      {status !== 'completed' && !error && (
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <div className="w-2 h-2 bg-[#F6821F] rounded-full animate-ping" />
          <span>Processing...</span>
        </div>
      )}
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 animate-slide-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-red-800 text-sm">Error</h4>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
