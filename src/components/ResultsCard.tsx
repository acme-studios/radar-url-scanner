import { useState } from 'react'
import { Button } from './ui/button.tsx'

interface ResultsCardProps {
  sessionId: string
  url: string
  email?: string
  onReset: () => void
}

export function ResultsCard({ sessionId, url, onReset }: ResultsCardProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [emailInput, setEmailInput] = useState('')

  const handleDownload = () => {
    // Create a temporary link and click it to trigger download
    const link = document.createElement('a')
    link.href = `/api/download/${sessionId}`
    link.download = `radar-scan-${sessionId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSendEmail = async () => {
    if (!emailInput.trim()) {
      setEmailError('Please enter a valid email address')
      return
    }

    setIsSendingEmail(true)
    setEmailError(null)

    try {
      const response = await fetch(`/api/email/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send email')
      }

      setEmailSent(true)
      setShowEmailInput(false)
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Failed to send email')
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 animate-fade-in max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#F6821F] to-[#FF9A3C] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Scan Complete!
        </h2>
        <p className="text-sm text-gray-600">
          Report ready for <span className="font-semibold text-[#F6821F]">{url}</span>
        </p>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        {/* Download Button */}
        <Button
          onClick={handleDownload}
          className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold bg-gradient-to-r from-[#F6821F] to-[#FF9A3C] hover:from-[#E5751A] hover:to-[#F6821F] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF Report
        </Button>

        {/* Send Email Section */}
        {!emailSent ? (
          !showEmailInput ? (
            <Button
              onClick={() => setShowEmailInput(true)}
              className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Report via Email
            </Button>
          ) : (
            <div className="space-y-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F6821F] focus:border-[#F6821F] transition-all duration-200"
                disabled={isSendingEmail}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="flex-1 bg-gradient-to-r from-[#F6821F] to-[#FF9A3C] hover:from-[#E5751A] hover:to-[#F6821F] text-white rounded-xl font-bold"
                >
                  {isSendingEmail ? 'Sending...' : 'Send Email'}
                </Button>
                <Button
                  onClick={() => {
                    setShowEmailInput(false)
                    setEmailError(null)
                  }}
                  disabled={isSendingEmail}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 text-center animate-slide-in">
            <p className="text-sm text-green-700 font-medium">
              ✓ Email sent successfully to {emailInput}
            </p>
          </div>
        )}

        {emailError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 animate-slide-in">
            <p className="text-sm text-red-700">{emailError}</p>
          </div>
        )}
      </div>

      {/* Start New Scan */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button
          onClick={onReset}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-xl font-bold transition-all duration-200"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start New Scan
        </Button>
      </div>
    </div>
  )
}
