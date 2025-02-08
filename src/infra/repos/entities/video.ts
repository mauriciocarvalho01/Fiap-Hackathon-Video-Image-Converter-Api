import {
    IsString,
    IsNotEmpty,
    IsUUID,
    IsOptional,
    ValidateNested,
    IsArray,
    IsObject,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { IsFile } from '@/main/factories/application/validation';

  class Metadata {
    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsObject()
    @IsOptional()
    imageResolution?: { width: number; height: number };
  }

  export class Video {
    @IsUUID()
    @IsNotEmpty()
    userId!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsFile({ mime: ['application/video', 'video/mp4']}, {message: 'Apenas video MP4 é suportado'})
    @IsNotEmpty()
    file!: any; // File type; could be refined with specific validation

    @ValidateNested()
    @Type(() => Metadata)
    @IsOptional()
    metadata?: Metadata;
  }
