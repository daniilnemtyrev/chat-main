import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTokens } from './dto/create-tokens';
import { Token } from './tokens.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token) private tokenRepository: typeof Token,  private jwtService: JwtService) {}

  async generateToken(user) {
    const payload = { email: user.email, id: user.id };
    return {
      acessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload)
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await this.tokenRepository.findOne({
      where: {userId: userId},
      include: {all: true}
    });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await this.tokenRepository.create({userId: userId, refreshToken});
    return token;
  }
}
