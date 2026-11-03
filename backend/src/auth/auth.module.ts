import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthTokenService } from "./services/auth-token.service";
import { CepValidationService } from "./services/cep-validation.service";
import { LoginAttemptService } from "./services/login-attempt.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    CloudinaryModule,
    EmailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN") ?? "1d",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    CepValidationService,
    LoginAttemptService,
    AuthTokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
