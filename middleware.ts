import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname
  
  console.log("[MIDDLEWARE]", { 
    pathname, 
    isLoggedIn, 
    hasAuth: !!req.auth,
    userEmail: req.auth?.user?.email 
  })

  const isOnAuthPage = pathname.startsWith("/auth")
  const isOnDashboard = pathname.startsWith("/dashboard")
  const isOnProjects = pathname.startsWith("/projects")
  const isOnAccount = pathname.startsWith("/account")

  // Protected routes that require authentication
  const isProtectedRoute = isOnDashboard || isOnProjects || isOnAccount

  if (isProtectedRoute && !isLoggedIn) {
    console.log("[MIDDLEWARE] Redirecting to /auth - protected route without login")
    return Response.redirect(new URL("/auth", req.nextUrl))
  }

  // If logged in and on auth page, redirect to dashboard
  if (isLoggedIn && isOnAuthPage) {
    console.log("[MIDDLEWARE] Redirecting to /dashboard - already logged in")
    return Response.redirect(new URL("/dashboard", req.nextUrl))
  }

  console.log("[MIDDLEWARE] Allowing request to proceed")
  return undefined
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}