import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe, UseGuards, Request, ClassSerializerInterceptor, UseInterceptors, Req
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { ApiBody, ApiParam, ApiQuery } from "@nestjs/swagger";
import { LoginUserDTO, RegistrationUserDTO, VerifyEmailCodeDTO } from './user.dto';


@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  // @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Req() request: Request) {
    const auth = request.headers["authorization"]
    return this.usersService.getUsers(auth);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUser(id);
  }

  @Post('auth/registration')
  @ApiBody({
    description: "Registration user",
    type: RegistrationUserDTO
  })
  async registration(@Body() user: RegistrationUserDTO) {
    return this.usersService.registrationUser(user);
  }

  @Post('auth/login')
  @ApiBody({
    description: "Login user",
    type: LoginUserDTO
  })
  async login(@Body() user: LoginUserDTO) {
    return this.usersService.loginUser(user);
  }

  @Post('auth/verificationEmail')
  @ApiBody({
    description: "verification email",
    type: VerifyEmailCodeDTO
  })
  async verificationEmail(@Body() verifyBody: VerifyEmailCodeDTO) {
    return this.usersService.verifyCode(verifyBody);
  }


}


