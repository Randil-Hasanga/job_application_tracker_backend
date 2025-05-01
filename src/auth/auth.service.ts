import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/entities/user.entity';
import { UserDetails } from 'src/utils/types';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async validateUser(userDetails: UserDetails) {
        try {
            const user = await this.userModel.findOne({ email: userDetails.email });
            console.log("User found", user);
            if (user) return user;
            console.log("User not found, creating new user");
            const newUser = await this.userModel.create(userDetails);
            console.log('Auth service', newUser);
            return newUser;

        } catch (error) {
            console.error("Error validating user", error);
            throw new Error('Error validating user');
        }
    }

    async findUser(id: number) {
        try {
            const user = await this.userModel.findById(id);
            return user;
        } catch (error) {
            console.error("Error finding user", error);
            throw new Error('Error finding user');
        }
    }
}
