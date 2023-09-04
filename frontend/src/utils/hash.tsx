import { hash } from 'bcryptjs'
import { SHA256 } from 'crypto-js'
export const encrypt = async (password: string) => {
  return await hash(SHA256(password).toString(), 10)
}
