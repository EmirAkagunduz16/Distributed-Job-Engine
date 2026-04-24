import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// __dirname differs between environments:
//   dev    -> <repo>/apps/auth/prisma/   (schema.prisma sits next to this file)
//   docker -> /app/                      (schema.prisma is under /app/prisma/)
// Resolve whichever layout exists so the same config works in both.
const localSchema = path.join(__dirname, 'schema.prisma');
const nestedSchema = path.join(__dirname, 'prisma', 'schema.prisma');
const schemaPath = fs.existsSync(localSchema) ? localSchema : nestedSchema;
const migrationsPath = path.join(path.dirname(schemaPath), 'migrations');

export default defineConfig({
  schema: schemaPath,
  migrations: {
    path: migrationsPath,
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
