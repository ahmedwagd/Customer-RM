import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ example: 'VIP' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ default: '#6366f1' })
  @IsOptional()
  @IsString()
  color?: string;
}
