import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { VerificationsCodeEntity } from '../verificationCods/verificationsCode.entity';
import { IBaseResponse } from '../common/baseResponse.type';
import { LoginUserDTO, RegistrationUserDTO, VerifyEmailCodeDTO } from './user.dto';
import { ConfigService } from "@nestjs/config";
import makeRandomId from 'src/utils/generateRandomString';


@Injectable()
export class UsersService {
    private code;
    constructor(
        private readonly jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(VerificationsCodeEntity) private verificationsCodeEntityRepository: Repository<VerificationsCodeEntity>,
        private mailerService: MailerService
    ) {
        this.code = makeRandomId(64);
    }


    async registrationUser(comeInUser: RegistrationUserDTO): Promise<any> {
        try {
            const existUser = await this.userRepository.findOne({ where: { email: comeInUser.email } });
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(comeInUser.password, salt);
            if (existUser) {
                const payload = { email: comeInUser.email, sub: comeInUser.password };
                const generatedToken = this.jwtService.sign(payload)
                if (!bcrypt.compare(comeInUser.password, existUser.password)) {
                    return { ...new HttpException(`You have been registered ,Your password is invalid to login`, HttpStatus.UNAUTHORIZED) };
                }
                if (existUser.isEmailVerified) {
                    return { status: true, message: "You have been registered, you signed up success", body: { accessToken: generatedToken, email: existUser.email } }
                } else {
                    const userVerificationCodeTable = await this.verificationsCodeEntityRepository.findOne({ where: { uuid: existUser.uuid } });
                    this.verificationsCodeEntityRepository.save({ id: userVerificationCodeTable.id, emailVerificationCode: this.code })
                    await this.sendConfirmationEmail({ fullname: existUser.fullname, email: existUser.email, url: `${this.configService.get<string>('SITE_BASE_URL')}/account/verificationEmail?verificationCode=${this.code}&uuid=${existUser.uuid}` });
                    return { status: true, message: `The new verification link sent to ${existUser.email}`, body: { email: existUser.email } }
                }
            } else {
                const userFullname = comeInUser.email.slice(0, comeInUser.email.indexOf("@")).toLowerCase();
                const userBody = {
                    fullname: userFullname,
                    email: comeInUser.email.toLowerCase(),
                    password: hash,
                }
                const newUser = await this.userRepository.save(userBody);
                const verificationBody = {
                    emailVerificationCode: this.code,
                    uuid: newUser.uuid
                }
                const saveVerificationCodeEmail = await this.verificationsCodeEntityRepository.save(verificationBody)
                await this.sendConfirmationEmail({ fullname: newUser.fullname, email: newUser.email, url: `${this.configService.get<string>('SITE_BASE_URL')}/account/verificationEmail?verificationCode=${this.code}&uuid=${newUser.uuid}` });
                return { status: true, message: `The verification link sent to ${comeInUser.email}`, body: { fullname: userFullname, email: comeInUser.email } }
            }
        } catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async verifyCode(verifyBody: VerifyEmailCodeDTO): Promise<any> {
        try {

            const existUser = await this.userRepository.findOne({ where: { uuid: verifyBody.uuid } });
            if (existUser) {
                const payload = { email: existUser.email, sub: existUser.password };
                const generatedToken = this.jwtService.sign(payload)
                if (existUser.isEmailVerified) {
                    await this.userRepository.save({ id: existUser.id, accessToken: generatedToken })
                    return { status: true, message: "Your email has been registered, transfer to home page", body: { accessToken: generatedToken, email: existUser.email, isAdmin: existUser.isAdmin, fullname: existUser.fullname, isEmailVerified: existUser.isEmailVerified } }
                } else {
                    const userVerificationCodeTable = await this.verificationsCodeEntityRepository.findOne({ where: { uuid: existUser.uuid } });
                    if (userVerificationCodeTable.emailVerificationCode !== verifyBody.verificationCode) return { status: false, body: new HttpException("", HttpStatus.UNAUTHORIZED), message: 'Verification code is invalid' }
                    else {
                        await this.userRepository.save({ id: existUser.id, isEmailVerified: true, accessToken: generatedToken })
                        return { status: true, message: "Your email is verified, continue to home", body: { accessToken: generatedToken, email: existUser.email, isAdmin: existUser.isAdmin, fullname: existUser.fullname, isEmailVerified: existUser.isEmailVerified } }
                    }
                }
            } else {
                return new HttpException("Verification code has expired or not found", HttpStatus.UNAUTHORIZED)
            }
        }
        catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async sendConfirmationEmail(user: any) {
        const { email, fullname, url } = await user

        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Nice App! Confirm Email',
            template: './confirm',
            context: {
                fullname: fullname,
                url: url
            },
        });
    }

    async sendConfirmedEmail(user: any) {
        const { email, fullname } = user
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Nice App! Email Confirmed',
            template: 'confirmed',
            context: {
                fullname,
                email
            },
        });
    }

    async loginUser(user: LoginUserDTO): Promise<any> {
        try {
            const existUser = await this.userRepository.findOne({ where: { email: user.email } });
            if (existUser) {
                const payload = { email: user.email, sub: user.password };
                const generatedToken = this.jwtService.sign(payload)
                if (!await bcrypt.compare(user.password, existUser.password)) {
                    return new HttpException("Your password is invalid", HttpStatus.UNAUTHORIZED)
                }
                await this.userRepository.save({ id: existUser.id, accessToken: generatedToken })
                if (existUser.isEmailVerified) {
                    return { status: true, message: "You have been registered, you signed up success", body: { accessToken: generatedToken, email: existUser.email, isAdmin: existUser.isAdmin, fullname: existUser.fullname, isEmailVerified: existUser.isEmailVerified } }
                } else {
                    const userVerificationCodeTable = await this.verificationsCodeEntityRepository.findOne({ where: { uuid: existUser.uuid } });
                    this.verificationsCodeEntityRepository.save({ id: userVerificationCodeTable.id, emailVerificationCode: this.code })
                    await this.sendConfirmationEmail({ fullname: existUser.fullname, email: existUser.email, url: `${this.configService.get<string>('SITE_BASE_URL')}/account/verificationEmail?verificationCode=${this.code}&uuid=${existUser.uuid}` });
                    return { status: true, message: `The new verification Link sent to ${existUser.email}`, body: { email: existUser.email } }
                }
            } else {
                return new HttpException("User not found", HttpStatus.NOT_FOUND)
            }
        } catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getUsers(comingAccessToken: any): Promise<any> {
        try {
            const existUser = await this.userRepository.findOne({
                where: { accessToken: comingAccessToken }
            });

            if (!existUser.isAdmin) {
                return new HttpException("Just admin access", HttpStatus.UNAUTHORIZED)
            }

            return await this.userRepository.find({
                where: { isAdmin: false },
                select: ['createdAt', 'email', 'fullname', 'isEmailVerified']
            });
        }
        catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findUser(email: any): Promise<UserEntity> {
        const existUser = await this.userRepository.findOne({ where: { email: email } });
        return existUser;
    }


}
