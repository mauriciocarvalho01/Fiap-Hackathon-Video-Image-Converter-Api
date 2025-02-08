export interface TokenValidator {
  validateJwt: (input: TokenValidator.Input) => Promise<string>;
  generateJwt: (payload: object, expiresIn: string | number) => string
  hashPassword: (password: string) => Promise<string>
  verifyPassword: (password: string, hashedPassword: string) => Promise<boolean>
  generateUuid: () => string
}

export namespace TokenValidator {
  export type GenericType<T=any> = T
  export type Input = { token: string };

}
