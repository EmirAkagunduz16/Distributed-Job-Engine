FROM node:18-slim as builder

WORKDIR /workspace

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./ 
COPY .eslintrc.json ./

COPY apps/jobs ./apps/jobs
COPY libs/graphql ./libs/graphql 
COPY libs/grpc ./libs/grpc 
COPY libs/prisma ./libs/prisma 
COPY libs/pulsar ./libs/pulsar 

RUN npm install

RUN npx nx build jobs

FROM node:18-slim as runner

WORKDIR /app

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/apps/jobs/package.json ./apps/jobs/package.json
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/libs/prisma/package.json ./libs/prisma/package.json
COPY --from=builder /workspace/libs/pulsar/package.json ./libs/pulsar/package.json
COPY --from=builder /workspace/libs/nestjs/package.json ./libs/nestjs/package.json
COPY --from=builder /workspace/package-lock.json ./

RUN npm ci -only=production

COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/jobs/main"]
