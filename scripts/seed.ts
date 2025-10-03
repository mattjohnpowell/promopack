import { prisma } from "../utils/db"
import { saltAndHashPassword } from "../utils/password"

async function main() {
  const email = "test@example.com"
  const password = "password123"
  const hashed = saltAndHashPassword(password)

  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email,
      password: hashed,
    },
  })

  console.log("User created:", user.email)
}

main().catch(console.error)