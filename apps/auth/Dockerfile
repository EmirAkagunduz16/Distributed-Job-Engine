FROM node:22-slim AS builder

WORKDIR /workspace

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY webpack.*.config.js ./

COPY apps/auth ./apps/auth
COPY libs/graphql ./libs/graphql
COPY libs/grpc ./libs/grpc
COPY libs/prisma ./libs/prisma
COPY libs/nestjs ./libs/nestjs

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

RUN cd apps/auth && npx prisma generate

RUN npx nx build auth

FROM node:22-slim AS runner

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/apps/auth/package.json ./apps/auth/package.json
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/apps/auth/prisma ./prisma
COPY --from=builder /workspace/apps/auth/prisma/prisma.config.ts ./prisma.config.ts
COPY --from=builder /workspace/libs/prisma/package.json ./libs/prisma/package.json
COPY --from=builder /workspace/package-lock.json ./

ENV NODE_ENV=production

RUN npm ci

# Copy build output
COPY --from=builder /workspace/dist ./dist

COPY --from=builder /workspace/apps/auth/generated ./apps/auth/generated

COPY apps/auth/docker-entrypoint.sh ./app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]