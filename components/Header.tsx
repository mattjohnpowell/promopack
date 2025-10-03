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
            <Link href="/pricing" className="text-pharma-slate hover:text-pharma-blue transition-colors">
              Pricing
            </Link>
            {session ? (
              <Link href="/dashboard" className="text-pharma-slate hover:text-pharma-blue transition-colors">
                Dashboard
              </Link>
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