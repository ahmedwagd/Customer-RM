import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvConfig } from './config.module';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  private get<T extends keyof EnvConfig>(key: T): EnvConfig[T] {
    return this.config.getOrThrow<EnvConfig[T]>(key);
  }

  get port() {
    return this.get('PORT');
  }

  get databaseUrl() {
    return this.get('DATABASE_URL');
  }

  get jwtSecret() {
    return this.get('JWT_SECRET');
  }

  get jwtRefreshSecret() {
    return this.get('JWT_REFRESH_SECRET');
  }

  get jwtExpiresIn() {
    return this.get('JWT_EXPIRES_IN');
  }

  get jwtRefreshExpiresIn() {
    return this.get('JWT_REFRESH_EXPIRES_IN');
  }

  get nodeEnv() {
    return this.get('NODE_ENV');
  }

  get isProduction() {
    return this.nodeEnv === 'production';
  }
}
