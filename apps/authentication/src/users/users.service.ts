import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RegisterUserDto } from '../../../../common/dto/register-user.dto';
import { UserResponseDto } from '../../../../common/dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async register(dto: RegisterUserDto): Promise<UserResponseDto> {
    this.logger.log(`Registering user: ${dto.email}`);

    // Check if user already exists
    const existingUserByEmail = await this.usersRepository.findByEmail(
      dto.email,
    );
    if (existingUserByEmail) {
      throw new ConflictException('Email already registered');
    }

    const existingUserByUsername = await this.usersRepository.findByUsername(
      dto.username,
    );
    if (existingUserByUsername) {
      throw new ConflictException('Username already taken');
    }

    // In a real application, you should hash the password here
    // For simplicity, we're storing it as-is (NOT RECOMMENDED IN PRODUCTION)
    const user = await this.usersRepository.create(dto);

    return this.mapToResponseDto(user);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    this.logger.log('Fetching all users');
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.mapToResponseDto(user));
  }

  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}

