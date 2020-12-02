import {Body, Controller, Inject, Post} from '@nestjs/common';
import {RegisterUserResponse} from "../interfaces/user";
import {UserService} from "./user.service";
import {RegisterDto} from "./dto/register.dto";

@Controller('user')
export class UserController {
    constructor(
        @Inject(UserService) private userService: UserService,
    ) {
    }

    @Post('/register')
    register(
        @Body() newUser: RegisterDto,
    ): Promise<RegisterUserResponse> {
        return this.userService.register(newUser);
    }
}
