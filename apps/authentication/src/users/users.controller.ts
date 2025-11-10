import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { RegisterUserDto } from '../../../../common/dto/register-user.dto';
import { UserResponseDto } from '../../../../common/dto/user-response.dto';
import { LoginUserDto } from '../../../../common/dto/login-user.dto';
import { MessagePattern as MessagePatternEnum } from '../../../../common/interfaces/message-patterns.interface';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(MessagePatternEnum.USER_REGISTER)
  async register(
    @Payload() dto: RegisterUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.register(dto);
  }

  @MessagePattern(MessagePatternEnum.USER_GET_ALL)
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.usersService.getAllUsers();
  }

  @MessagePattern(MessagePatternEnum.USER_LOGIN)
  async login(@Payload() dto: LoginUserDto): Promise<any> {
    return this.usersService.login(dto);
  }
}

