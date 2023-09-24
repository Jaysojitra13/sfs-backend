import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './auth.interface';
import { LogInDto, SignUpDto } from './auth.dto';
import * as passwordHash from 'password-hash';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async signUp(userObj: SignUpDto): Promise<User> {
    // check duplicate email
    const userExists = await this.userModel.findOne({ email: userObj.email });
    if (userExists) {
      throw new HttpException(
        'User already exists with this email',
        HttpStatus.BAD_REQUEST,
      );
    }

    userObj.password = passwordHash.generate(userObj.password, {
      algorithm: 'sha512',
    });

    const objToSave = new this.userModel(userObj);
    await objToSave.save();
    return {
      _id: objToSave._id,
      fullName: objToSave.fullName,
      email: objToSave.email,
    };
  }

  async login(userObj: LogInDto): Promise<any> {
    // check user exists or not
    const userExists = await this.userModel.findOne({ email: userObj.email });
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (passwordHash.verify(userObj.password, userExists.password)) {
      // generate token
      const token = jwt.sign(
        { email: userExists.email, _id: userExists._id },
        process.env.JWT_SECRET,
      );
      return {
        _id: userExists._id,
        email: userExists.email,
        fullName: userExists.fullName,
        token,
      };
    } else {
      throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
    }
  }
}
