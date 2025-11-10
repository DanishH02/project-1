import { Injectable, ConflictException, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { RegisterUserDto } from '../../../../common/dto/register-user.dto';
import { UserResponseDto } from '../../../../common/dto/user-response.dto';
import { LoginUserDto } from '../../../../common/dto/login-user.dto';

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

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.mapToResponseDto(user);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    this.logger.log('Fetching all users');
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.mapToResponseDto(user));
  }

  async login(dto: LoginUserDto): Promise<any> {
    this.logger.log(`Login attempt for: ${dto.email}`);
    
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    };
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

