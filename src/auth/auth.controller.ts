import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, SignUpDto } from './auth.dto';
import { User } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/sign-up')
  async SignUp(@Body() signUpDto: SignUpDto): Promise<User> {
      return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  async Login(@Body() loginDto: LogInDto): Promise<User> {
      return this.authService.login(loginDto);
  }

}
