import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { AuthGuard } from '../auth/auth.guard';
import type { JwtPayload } from '../auth/dtos/jwt-payload';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('todos')
@UseGuards(AuthGuard)
export class TodosController {

    constructor(private todoService : TodosService){}

   @Get()
  async getAllTodos(@CurrentUser() userPayload : JwtPayload): Promise<Todo[]> {
    return await this.todoService.findAll(userPayload.sub);
  }

  @Get(':id')
  // information passé par la route
  async getTodoById(@Param('id', ParseIntPipe) id: number,@CurrentUser() userPayload : JwtPayload): Promise<Todo> {
    return await this.todoService.findOne(id,userPayload.sub);
  }
  
@Post()
async createTodo(@Body() dto: CreateTodoDto, @CurrentUser() userPayload: JwtPayload): Promise<Todo> {
  return this.todoService.create(dto, userPayload.sub);
}

  @Put(':id')
  async updateTodo(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTodoDto,@CurrentUser() userPayload : JwtPayload): Promise<Todo> {
    return await this.todoService.update(id, dto,userPayload.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTodo(@Param('id', ParseIntPipe) id: number,@CurrentUser() userPayload : JwtPayload): Promise<void> {
    return await this.todoService.remove(id,userPayload.sub);

  }
}
