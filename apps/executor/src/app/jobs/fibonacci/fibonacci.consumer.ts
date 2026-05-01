import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { FibonacciMessage, PulsarClient } from '@jobber/pulsar';
import { iterate } from 'fibonacci';
import { Jobs } from '@jobber/nestjs';
import { JobConsumer } from '../job.consumer';
import { PACKAGES } from '@jobber/grpc';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class FibonacciConsumer
  extends JobConsumer<FibonacciMessage>
  implements OnModuleInit
{
  constructor(
    pulsarClient: PulsarClient,
    @Inject(PACKAGES.JOBS) clientJobs: ClientGrpc,
  ) {
    super(Jobs.FIBONACCI, pulsarClient, clientJobs);
  }

  protected async execute(data: FibonacciMessage): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}
