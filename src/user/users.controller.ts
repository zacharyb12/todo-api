import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { UserUpdate } from './dtos/user-update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UpdateRoleDto } from './dtos/update-role.dto';
import type { JwtPayload } from '../auth/dtos/jwt-payload';
import { UserDto } from './dtos/user.dto';
import { UserFullDto } from './dtos/user-full.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {


  constructor(private userService : UserService){}

  @Get()
  async getAllUsers(@CurrentUser() userPayload : JwtPayload): Promise<UserFullDto[]> {
        if(userPayload.role != 'admin'){
      throw new ForbiddenException('Vous ne pouvez pas consulter les utilisateurs si vous n\'êtes pas administrateur ')
    }
    return await this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number,@CurrentUser() userPayload : JwtPayload): Promise<UserDto> {
    if(userPayload.sub != id  && userPayload.role != 'admin'){
      throw new ForbiddenException('Vous ne pouvez pas accéder au informations de ce compte')
    }

    return await this.userService.findOne(id);
  }

  @Put(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UserUpdate ,@CurrentUser() userPayload : JwtPayload): Promise<UserDto> {
    if(userPayload.sub != id){
      throw new ForbiddenException('Vous ne pouvez pas modifier les informations de ce compte')
    }
    return await this.userService.update(id, dto);
  }

    @Put(':id/role')
  async updateUserRole(@Param('id', ParseIntPipe) id: number, @Body() dto : UpdateRoleDto , @CurrentUser() userPayload : JwtPayload): Promise<UserDto> {
    if(userPayload.role != 'admin'){
      throw new ForbiddenException('Vous ne pouvez pas modifier le role d\'un utilisateur ')
    }
    return await this.userService.updateRole(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseIntPipe ) id: number ,@CurrentUser() userPayload : JwtPayload): Promise<void> {
    if(userPayload.sub != id){
      throw new ForbiddenException('Vous ne pouvez pas supprimer ce compte')
    }

    return await this.userService.remove(id);
  }
}
