"use client"
import { useState } from "react"
import { SignIn } from "./sign-in"
import { SignUp } from "./sign-up"
import { MagicLinkSignIn } from "./magic-link-sign-in"

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "magic">("signin")

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("signin")}
          className={`flex-1 py-2 px-4 text-center border-b-2 font-medium text-sm ${
            activeTab === "signin"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab("magic")}
          className={`flex-1 py-2 px-4 text-center border-b-2 font-medium text-sm ${
            activeTab === "magic"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Magic Link
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={`flex-1 py-2 px-4 text-center border-b-2 font-medium text-sm ${
            activeTab === "signup"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Sign Up
        </button>
      </div>

      {activeTab === "signin" && <SignIn />}
      {activeTab === "magic" && <MagicLinkSignIn />}
      {activeTab === "signup" && <SignUp />}
    </div>
  )
}