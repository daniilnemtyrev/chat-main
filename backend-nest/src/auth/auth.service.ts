import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { TokenService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const tokens = this.tokenService.generateToken(user);
    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    const data = { ...tokens, user };
    return data;
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Email не найден',
      });
    }
    if (user != null) {
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (!passwordEquals) {
        throw new UnauthorizedException({
          message: 'Неверный пароль',
        });
      }
    }
    return user;
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    const tokens = this.tokenService.generateToken(user);
    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    const data = { ...tokens, user };
    return data;
  }
}
