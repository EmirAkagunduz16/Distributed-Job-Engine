import { Module } from '@nestjs/common';
import { LoggerModule } from '@jobber/nestjs';

@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
