import { UserData } from '@/domain/entities/user-account';
import { HttpResponse, unauthorized, ok, conflict } from '@/application/helpers'
import { AuthenticationError, RegisterError } from '@/domain/entities/errors'
import { UserAuthentication } from '@/domain/use-cases'

type HttpRequest = UserData
type AuthenticationResponse = Error | { accessToken: string, expireIn: number }
type RegisterAuthenticationResponse = Error | UserData

export class LoginController {
  constructor (
    private readonly  userAuthentication: UserAuthentication,
    private readonly  userRegisterAuthentication: UserAuthentication
  ) {}

  async handleUserLogin ({ email, password }: HttpRequest): Promise<HttpResponse<AuthenticationResponse>> {
    try {
      const accessToken = await this.userAuthentication({ email, password });
      return ok(accessToken)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      throw error
    }
  }

  async handleUserRegister (userData: HttpRequest): Promise<HttpResponse<RegisterAuthenticationResponse>> {
    try {
      await this.userRegisterAuthentication(userData);
      return ok(userData)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      if (error instanceof RegisterError) return conflict(error)
      throw error
    }
  }
}
