import { prisma } from "../utils/db"

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    console.log('\n📋 Users in database:')
    console.log('═'.repeat(60))
    
    if (users.length === 0) {
      console.log('No users found.')
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name || 'No name'}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   ID: ${user.id}`)
      })
    }
    
    console.log('\n' + '═'.repeat(60))
    console.log(`Total users: ${users.length}\n`)
  } catch (error) {
    console.error('Error listing users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
