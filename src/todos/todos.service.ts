import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {

constructor(
  @InjectRepository(Todo) private todoRepository : Repository<Todo>
){}

 findAll(userId : number): Promise<Todo[]> {
    return this.todoRepository.find({where : {user : {id : userId}}});
  }

  async findOne(id: number,userId : number): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id, user: { id: userId } });

    if (!todo) {
        throw new NotFoundException(`Todo ${id} introuvable`);
      }   

    return todo;
  }

  async create(dto: CreateTodoDto,userId : number): Promise<Todo> {

    const todo = this.todoRepository.create({ ...dto, user: { id: userId } });
    return this.todoRepository.save(todo);
  }

  async update(id: number, dto: UpdateTodoDto,userId : number): Promise<Todo> {
    const todo = await this.findOne(id,userId); // 404 si absent
    
    Object.assign(todo, dto);
    return this.todoRepository.save(todo);          // UPDATE
  }

  async remove(id: number,userId : number): Promise<void> {
    await this.findOne(id,userId);                   // 404 si absent
    await this.todoRepository.delete(id);           // DELETE
  }
}
