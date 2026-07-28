import { Body, Controller, Post } from '@nestjs/common';
import { Register } from './dtos/register.dto';
import { Login } from './dtos/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService : AuthService){}

    @Post('register')
    async register(@Body()register : Register) : Promise<{access_token : string}>{
        return await this.authService.register(register)
    }

    @Post('login')
    async login(@Body()login : Login) : Promise<{access_token : string}>{
         return await this.authService.login(login)
    }
}
