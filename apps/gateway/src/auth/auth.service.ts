import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { NetworkingService } from '../../../../common/services/networking.service';
import { MessagePattern } from '../../../../common/interfaces/message-patterns.interface';
import { RegisterUserDto } from '../../../../common/dto/register-user.dto';
import { UserResponseDto } from '../../../../common/dto/user-response.dto';
import { LoginUserDto } from '../../../../common/dto/login-user.dto';
import { LoginResponseDto } from '../../../../common/dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly networkingService: NetworkingService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<UserResponseDto> {
    return firstValueFrom(
      this.networkingService.send<UserResponseDto>(
        MessagePattern.USER_REGISTER,
        dto,
      ),
    );
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    return firstValueFrom(
      this.networkingService.send<UserResponseDto[]>(
        MessagePattern.USER_GET_ALL,
        {},
      ),
    );
  }

  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await firstValueFrom(
      this.networkingService.send<any>(
        MessagePattern.USER_LOGIN,
        dto,
      ),
    );

    const payload = { sub: user.id, email: user.email, username: user.username };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }
}

