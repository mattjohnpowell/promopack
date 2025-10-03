export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            A sign in link has been sent to your email address.
          </p>
          <p className="mt-4 text-center text-sm text-gray-600">
            Click the link in the email to sign in to your account. The link will expire in 24 hours.
          </p>
        </div>
        <div className="text-center">
          <a href="/auth" className="text-blue-600 hover:text-blue-500">
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  )
}
