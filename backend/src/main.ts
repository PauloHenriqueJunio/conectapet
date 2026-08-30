import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import type { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.disable("x-powered-by");

  app.use(
    helmet({
      // API JSON-only: no HTML/scripts are served, so a default CSP would
      // only block Swagger/docs if those are ever added here.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  app.use((_: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
    next();
  });

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://conectapet-app.vercel.app",
      "https://conectapet-frontend.vercel.app",
      /^https:\/\/conectapet-(?:app|frontend)-[a-zA-Z0-9-]+-paulo-henriques-projects(?:-[a-zA-Z0-9-]+)?\.vercel\.app$/,
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT ?? process.env.BACKEND_PORT ?? 3001);
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}

bootstrap();
