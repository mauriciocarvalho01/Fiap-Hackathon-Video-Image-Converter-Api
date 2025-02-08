import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';


export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export class User {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsEmail({}, { message: 'O email deve ser válido' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(UserRole, { message: 'O papel deve ser um dos valores válidos: admin, user ou moderator' })
  @IsOptional()
  role?: UserRole;
}
