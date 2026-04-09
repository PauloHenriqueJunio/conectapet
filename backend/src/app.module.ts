import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { buildRateLimitMessage } from "./common/rate-limit-message";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PetsModule } from "./pets/pets.module";
import { AdoptionModule } from "./adoption/adoption.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: "default",
          ttl: 60_000,
          limit: 100,
        },
      ],
      errorMessage: (_, throttlerLimitDetail) =>
        buildRateLimitMessage(throttlerLimitDetail),
    }),
    PrismaModule,
    CloudinaryModule,
    AuthModule,
    PetsModule,
    AdoptionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
