import path from 'node:path';
import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Load .env from the service root directory
const serviceRoot = path.resolve(__dirname, '..');
config({ path: path.join(serviceRoot, '.env') });

export default defineConfig({
  schema: path.join(__dirname, 'schema.prisma'),
  migrations: {
    path: path.join(__dirname, 'migrations'),
  },
  datasource: {
    url: env('AUTH_DATABASE_URL'),
  },
});
