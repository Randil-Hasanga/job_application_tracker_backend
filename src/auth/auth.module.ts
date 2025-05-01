import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './utils/google.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { SessionSerializer } from './utils/Serializer';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [GoogleStrategy, {provide: 'AUTH_SERVICE', useClass: AuthService}, SessionSerializer],
})
export class AuthModule {}
