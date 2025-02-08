export class RegisterError extends Error {
  constructor (message: string) {
    super('Register failed')
    this.name = 'AuthenticationError'
    this.message = message
  }
}
