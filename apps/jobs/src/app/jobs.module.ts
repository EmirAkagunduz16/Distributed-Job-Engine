import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PACKAGES } from '@jobber/grpc';
import { join } from 'path';
import { PulsarModule } from '@jobber/pulsar';
import { FibonacciJob } from './jobs/fibonacci/fibonacci.job';
import { JobsResolver } from './jobs.resolver';
import { ConfigService } from '@nestjs/config';
import { LoadProductsJob } from './jobs/products/load-products.job';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: PACKAGES.AUTH,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow('AUTH_SERVICE_GRPC_URL'),
            package: PACKAGES.AUTH,
            protoPath: join(__dirname, '../../libs/grpc/proto/auth.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [FibonacciJob, JobsService, JobsResolver, LoadProductsJob],
})
export class JobsModule {}
