import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AppConfigService } from '../config/config.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuid } from 'uuid';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<TokenPair> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        hashedPassword,
        avatarUrl: dto.avatarUrl,
      },
    });

    return this.generateTokens(user.id, user.email);
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.hashedPassword, dto.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) {
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.deleteMany({ where: { id: stored.id } });

    return this.generateTokens(stored.user.id, stored.user.email);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<TokenPair> {
    const accessToken = this.jwt.sign({ sub: userId, email });
    const refreshToken = uuid();
    const expiresAt = this.parseExpiry(this.config.jwtRefreshExpiresIn);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresAt,
    };
  }

  private parseExpiry(value: string): Date {
    const match = value.match(/^(\d+)([dhms])$/);
    if (!match) {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    }
    const num = parseInt(match[1], 10);
    const unit = match[2];
    const date = new Date();
    switch (unit) {
      case 'd':
        date.setDate(date.getDate() + num);
        break;
      case 'h':
        date.setHours(date.getHours() + num);
        break;
      case 'm':
        date.setMinutes(date.getMinutes() + num);
        break;
      case 's':
        date.setSeconds(date.getSeconds() + num);
        break;
    }
    return date;
  }
}
