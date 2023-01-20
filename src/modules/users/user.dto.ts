import { IsNotEmpty, IsString, IsNumber, MinLength, IsEmail, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";



export class RegistrationUserDTO {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}


export class VerifyEmailCodeDTO {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    verificationCode: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    uuid: string;
}

export class LoginUserDTO {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    password: string;
}
