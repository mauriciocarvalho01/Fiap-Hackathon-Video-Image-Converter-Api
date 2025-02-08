export type UserData = { userId?: string, name?: string, displayName?: string, email: string, password: string, role?: string }

export class UserAccount {
  userId?: string
  name?: string
  displayName?: string
  email!: string
  password!: string
  role?: string

  constructor (userData: UserData) {
    this.userId = userData.userId
    this.name = userData.name
    this.email = userData.email
    this.email = userData.email
    this.password = userData.password
    this.role = userData.role
  }
}
