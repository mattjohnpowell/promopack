"use client"

import { useState } from "react"
import { exportUserData, deleteUserAccount } from "@/app/actions"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface DataManagementClientProps {
  userEmail: string
}

export default function DataManagementClient({ userEmail }: DataManagementClientProps) {
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const data = await exportUserData()
      
      // Create a downloadable JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `promopack-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Your data has been downloaded successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      toast.error('Please type "DELETE MY ACCOUNT" exactly to confirm')
      return
    }

    setIsDeleting(true)
    try {
      await deleteUserAccount(deleteConfirmation)
      toast.success('Your account has been deleted')
      
      // Redirect to homepage after a brief delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete account')
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Data Management</h1>
        <p className="text-gray-600">Manage your personal data and privacy settings</p>
      </div>

      {/* Export Data Section */}
      <section className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Export Your Data</h2>
            <p className="text-gray-700 mb-4">
              Download all your data in JSON format. This includes all your projects, documents, claims, 
              and account information. (GDPR Article 20 - Right to Data Portability)
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">What&apos;s included in your export:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ All projects and their metadata</li>
                <li>✓ All documents (references and sources)</li>
                <li>✓ All claims and their review status</li>
                <li>✓ Document-claim linkages</li>
                <li>✓ Account and subscription information</li>
              </ul>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Preparing Export...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download My Data
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Privacy Information */}
      <section className="bg-green-50 rounded-xl p-6 mb-8 border border-green-200">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h3 className="font-semibold text-green-900 mb-2">Your Data is Protected</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>🔒 All data encrypted in transit and at rest (AES-256)</li>
              <li>🇪🇺 GDPR compliant data handling</li>
              <li>🚫 Your data is never shared with third parties</li>
              <li>📧 Logged in as: <strong>{userEmail}</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Delete Account Section */}
      <section className="bg-white rounded-xl shadow-md p-8 border border-red-200">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2 text-red-900">Danger Zone</h2>
            <p className="text-gray-700 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone. 
              (GDPR Article 17 - Right to Erasure)
            </p>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Delete My Account
              </button>
            ) : (
              <div className="bg-red-50 border border-red-300 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-3">⚠️ Are you absolutely sure?</h3>
                <div className="bg-white border border-red-200 rounded p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-3">This will permanently delete:</p>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>❌ All your projects and promotional materials</li>
                    <li>❌ All uploaded documents and references</li>
                    <li>❌ All extracted claims and linkages</li>
                    <li>❌ Your account and subscription history</li>
                    <li>❌ All billing information</li>
                  </ul>
                  <p className="text-sm font-semibold text-red-600">
                    This action is irreversible. Your data will be permanently deleted within 30 days.
                  </p>
                </div>
                
                <label className="block mb-4">
                  <span className="text-sm font-semibold text-gray-700 mb-2 block">
                    Type <code className="bg-gray-100 px-2 py-1 rounded text-red-600">DELETE MY ACCOUNT</code> to confirm:
                  </span>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE MY ACCOUNT"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </label>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmation !== 'DELETE MY ACCOUNT'}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeleteConfirmation("")
                    }}
                    disabled={isDeleting}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Privacy Policy Link */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          Questions about your data? Read our{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
          {' '}or{' '}
          <a href="/contact" className="text-blue-600 hover:underline">contact support</a>.
        </p>
      </div>
    </div>
  )
}
