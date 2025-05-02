import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/auth/entities/user.entity';
import { UserDetails } from 'src/utils/types';
import * as bcrypt from 'bcrypt';

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

    async findUser(id: string) {
        try {
            const user = await this.userModel.findById(new Types.ObjectId(id)).exec();
            if (!user) {
                console.error(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
            console.error("Error finding user", error);
            throw new Error('Error finding user');
        }
    }

    async validateUserByEmail(email: string, password: string) {
        try {
            const user = await this.userModel.findOne({ email });
            if (!user) {
                throw new Error('Invalid email or password');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            return user;
        } catch (error) {
            console.error('Error validating user by email:', error);
            throw new Error('Failed to validate user. Please try again later.');
        }
    }

    async registerUser(email: string, password: string, displayName: string) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await this.userModel.create({
                email,
                password: hashedPassword,
                displayName,
            });
            return newUser;
        } catch (error) {
            console.error('Error registering user:', error);
            throw new Error('Failed to register user. Please try again later.');
        }
    }
}
