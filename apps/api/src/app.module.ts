import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [PrismaModule, AppConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
