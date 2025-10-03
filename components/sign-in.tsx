"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
 
export function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn("credentials", { email, password })
  }
 
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="credentials-email">
        Email
        <input
          type="email"
          id="credentials-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label htmlFor="credentials-password">
        Password
        <input
          type="password"
          id="credentials-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Sign In</button>
    </form>
  )
}