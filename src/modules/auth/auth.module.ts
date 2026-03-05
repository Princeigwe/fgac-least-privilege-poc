import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport-strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt'; 
import { jwtConstants } from './constants';
import { JwtStrategy } from './passport-strategies/jwt.strategy';

@Module({
  imports: 
  [
    UsersModule, 
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '86400s'} 
    })
  ],
  providers: [
    AuthService, 
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
