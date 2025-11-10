import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { NetworkingService } from '../../../../common/services/networking.service';
import { MessagePattern } from '../../../../common/interfaces/message-patterns.interface';
import { RegisterUserDto } from '../../../../common/dto/register-user.dto';
import { UserResponseDto } from '../../../../common/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly networkingService: NetworkingService) {}

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
}

