import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-pharma-gray-light border-t border-pharma-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-pharma-blue mb-4">PromoPack</h3>
            <p className="text-pharma-slate text-sm">
              Professional promotional content management for pharmaceutical teams.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-pharma-slate mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="text-pharma-gray hover:text-pharma-blue transition-colors">Pricing</Link></li>
              <li><Link href="/features" className="text-pharma-gray hover:text-pharma-blue transition-colors">Features</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-pharma-slate mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="text-pharma-gray hover:text-pharma-blue transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-pharma-gray hover:text-pharma-blue transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-pharma-slate mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-pharma-gray hover:text-pharma-blue transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-pharma-gray hover:text-pharma-blue transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-pharma-gray mt-8 pt-8 text-center text-sm text-pharma-gray">
          <p>&copy; 2025 PromoPack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}