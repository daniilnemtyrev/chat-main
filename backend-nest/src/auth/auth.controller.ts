import { Body, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import {Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() userDto: CreateUserDto, @Res() res: Response) {
    const userData = await this.authService.login(userDto);
    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    return res.json(userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto, @Res() res: Response) {
    const userData = await this.authService.registration(userDto);
    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    return res.json(userData);
  }


}
