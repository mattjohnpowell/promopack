"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b border-pharma-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/promopack-logo.svg"
              alt="PromoPack Logo"
              width={120}
              height={120}
            />
          </Link>
          <nav className="hidden md:flex space-x-8">
            <div className="relative group">
              <button className="text-pharma-slate hover:text-pharma-blue transition-colors flex items-center">
                Solutions
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link href="/use-cases/medical-affairs" className="block px-4 py-3 hover:bg-pharma-blue/5 rounded-t-lg">
                  <div className="font-semibold text-pharma-slate">Medical Affairs</div>
                  <div className="text-sm text-pharma-gray">MLR workflow automation</div>
                </Link>
                <Link href="/use-cases/fda-compliance" className="block px-4 py-3 hover:bg-pharma-blue/5">
                  <div className="font-semibold text-pharma-slate">FDA Compliance (US)</div>
                  <div className="text-sm text-pharma-gray">US OPDP regulations</div>
                </Link>
                <Link href="/use-cases/ema-compliance" className="block px-4 py-3 hover:bg-pharma-blue/5">
                  <div className="font-semibold text-pharma-slate">EMA Compliance (EU)</div>
                  <div className="text-sm text-pharma-gray">European Union markets</div>
                </Link>
                <Link href="/use-cases/mhra-compliance" className="block px-4 py-3 hover:bg-pharma-blue/5 rounded-b-lg">
                  <div className="font-semibold text-pharma-slate">MHRA Compliance (UK)</div>
                  <div className="text-sm text-pharma-gray">United Kingdom post-Brexit</div>
                </Link>
              </div>
            </div>
            <Link href="/templates" className="text-pharma-slate hover:text-pharma-blue transition-colors">
              Templates
            </Link>
            <Link href="/blog" className="text-pharma-slate hover:text-pharma-blue transition-colors">
              Blog
            </Link>
            <Link href="/roi-calculator" className="text-pharma-slate hover:text-pharma-blue transition-colors">
              ROI Calculator
            </Link>
            <Link href="/pricing" className="text-pharma-slate hover:text-pharma-blue transition-colors">
              Pricing
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-pharma-slate hover:text-pharma-blue transition-colors">
                  Dashboard
                </Link>
                <Link href="/analytics" className="text-pharma-slate hover:text-pharma-blue transition-colors">
                  Analytics
                </Link>
              </>
            ) : null}
          </nav>
          <div className="flex items-center space-x-4">
            {session ? (
              <button
                onClick={() => signOut()}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/auth" className="text-pharma-slate hover:text-pharma-blue transition-colors text-sm">
                  Sign In
                </Link>
                <Link href="/auth" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}