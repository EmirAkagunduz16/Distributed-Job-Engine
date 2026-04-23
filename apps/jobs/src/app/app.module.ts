import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JobsModule } from "./jobs.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { LoggerModule } from "@jobber/nestjs";
import { GqlLoggingPlugin } from "@jobber/graphql";

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "apps/jobs/.env"],
    }),
    JobsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // plugins: [new GqlLoggingPlugin()],
      playground: {
        settings: {
          "request.credentials": "include",
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
