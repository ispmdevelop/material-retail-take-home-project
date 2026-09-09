import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import { SignUpDto, LoginDto } from './dto/auth.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        organization: {
          create: {
            name: `${dto.name}'s Store`,
          },
        },
      },
      include: {
        organization: true,
      },
    });

    const accessToken = await this.generateToken(user.id, user.email, user.organization!.id);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: user.organization!.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        organization: true,
      },
    });

    if (!user || !user.organization) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateToken(user.id, user.email, user.organization.id);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: user.organization.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  private async generateToken(userId: string, email: string, organizationId: string): Promise<string> {
    const payload = { sub: userId, email, organizationId };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });
  }
}
