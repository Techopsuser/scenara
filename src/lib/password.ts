import bcrypt from 'bcryptjs'

/**
 * Hash a plaintext password using bcrypt.
 * Returns a string safe to store in `User.passwordHash`.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Verify a plaintext password against a stored bcrypt hash.
 * Returns true if the password matches.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash)
  } catch {
    return false
  }
}
