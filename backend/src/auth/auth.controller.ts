import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { RequestUser } from "./types/request-user.type";

@Controller("auth")
export class AuthController {
  private static readonly AUTH_COOKIE_NAME = "conectapet_session";

  constructor(private readonly authService: AuthService) {}

  private getAuthCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    };
  }

  @Post("register")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const auth = await this.authService.login(dto);
    res.cookie(
      AuthController.AUTH_COOKIE_NAME,
      auth.accessToken,
      this.getAuthCookieOptions(),
    );

    return { user: auth.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(
      AuthController.AUTH_COOKIE_NAME,
      this.getAuthCookieOptions(),
    );

    return { success: true };
  }

  @Get("ongs")
  getOngs() {
    return this.authService.getOngs();
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req: { user: RequestUser }) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("profile")
  updateProfile(
    @Req() req: { user: RequestUser },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("photo")
  @UseInterceptors(FileInterceptor("photo"))
  uploadPhoto(
    @Req() req: { user: RequestUser },
    @UploadedFile() file?: { mimetype: string; size: number; buffer: Buffer },
  ) {
    if (!file) {
      throw new BadRequestException("Nenhuma imagem enviada.");
    }

    return this.authService.uploadPhoto(req.user.userId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("account")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async deleteAccount(
    @Req() req: { user: RequestUser },
    @Body() dto: DeleteAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.deleteAccount(
      req.user.userId,
      dto,
    );

    res.clearCookie(
      AuthController.AUTH_COOKIE_NAME,
      this.getAuthCookieOptions(),
    );

    return result;
  }
}
