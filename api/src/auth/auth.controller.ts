import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignUpDto, LoginDto, AuthResponseDto } from './dto/auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signUp(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }
}
