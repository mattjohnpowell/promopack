import { prisma } from "../utils/db"

async function checkUsers() {
  const users = await prisma.user.findMany()
  console.log("Existing users:", users.length)
  users.forEach(user => {
    console.log(`- ${user.email} (${user.name})`)
  })
}

checkUsers().catch(console.error)