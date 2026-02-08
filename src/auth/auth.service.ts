import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schemas';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, companyName } = registerDto;
    try {
      const user = new this.userModel({ email, password, companyName });
      await user.save();
      return { message: 'User registered successfully' };
    } catch (error) {
      throw new ConflictException('Email already exists');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user._id, email: user.email };
      return {
        token: this.jwtService.sign(payload),
        companyName: user.companyName,
        userId: user._id,
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}