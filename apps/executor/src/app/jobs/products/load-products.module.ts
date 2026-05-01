import { Module } from '@nestjs/common';
import { LoadProductsConsumer } from './load-products.consumer';
import { PulsarModule } from '@jobber/pulsar';
import { ConfigService } from '@nestjs/config';
import { PACKAGES } from '@jobber/grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PACKAGES.PRODUCTS,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow('PRODUCTS_SERVICE_GRPC_URL'),
            package: PACKAGES.PRODUCTS,
            protoPath: join(__dirname, '../../libs/grpc/proto/products.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    PulsarModule,
  ],
  providers: [LoadProductsConsumer],
})
export class LoadProductsModule {}
