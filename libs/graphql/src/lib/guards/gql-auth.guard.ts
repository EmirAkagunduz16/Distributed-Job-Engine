import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { PACKAGES, AUTH_SERVICE_NAME, AuthServiceClient } from '@jobber/grpc';
import { ClientGrpc } from '@nestjs/microservices';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(GqlAuthGuard.name);
  private authService: AuthServiceClient;

  constructor(@Inject(PACKAGES.AUTH) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = this.getRequest(context);
    const token = req.cookies?.Authentication || req.headers?.authorization?.split(' ')[1];

    if (!token) {
      this.logger.error('Token bulunamadi!')
      return false;
    }

    return this.authService.authenticate({ token }).pipe(
      map((res) => {
        req.user = res;
        return true;
      }),
      catchError((error) => {
        this.logger.error(error);
        return of(false);
      }),
    );
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
