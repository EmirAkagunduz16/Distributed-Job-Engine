import { Producer } from 'pulsar-client';
import { PulsarClient } from '@jobber/pulsar';
import { OnModuleDestroy } from '@nestjs/common';

export abstract class AbstractJob implements OnModuleDestroy {
  private producer: Producer;

  constructor(private readonly pulsarClient: PulsarClient) {}

  async execute(data: object, job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }
    await this.producer.send({ data: Buffer.from(JSON.stringify(data)) });
  }

  async onModuleDestroy() {
    await this.producer.close();
  }
}
