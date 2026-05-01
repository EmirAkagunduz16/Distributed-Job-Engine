import { PACKAGES } from '@jobber/grpc';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PACKAGES.JOBS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow('JOBS_SERVICE_GRPC_URL'),
            package: PACKAGES.JOBS,
            protoPath: join(__dirname, '../../libs/grpc/proto/jobs.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class JobClientsModule {}
