import { prisma } from "../utils/db"
import { saltAndHashPassword } from "../utils/password"

async function resetPassword(email: string, newPassword: string) {
  try {
    console.log(`\n🔐 Resetting password for: ${email}`)
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.error(`❌ User not found: ${email}`)
      return
    }

    // Hash the new password
    const hashedPassword = saltAndHashPassword(newPassword)

    // Update the user
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    console.log(`✅ Password updated successfully!`)
    console.log(`\nYou can now sign in with:`)
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${newPassword}`)
    console.log()
  } catch (error) {
    console.error('❌ Error resetting password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email and password from command line arguments
const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('\n❌ Usage: npx tsx scripts/reset-password.ts <email> <new-password>')
  console.error('\nExample:')
  console.error('   npx tsx scripts/reset-password.ts mattjohnpowell@gmail.com MyNewPassword123')
  console.error()
  process.exit(1)
}

resetPassword(email, password)
