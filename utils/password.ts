import bcrypt from "bcryptjs"

export function saltAndHashPassword(password: string): string {
  const saltRounds = 10
  return bcrypt.hashSync(password, saltRounds)
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword)
}