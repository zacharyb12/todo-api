import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserUpdate } from './dtos/user-update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Register } from '../auth/dtos/register.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { UserDto } from './dtos/user.dto';
import { UserFullDto } from './dtos/user-full.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepository : Repository<User>
    ){}

    // garde le user complet pour le token (register)
    create(registerForm : Register): Promise<User> {
        const user = this.userRepository.create(registerForm);
        return this.userRepository.save(user);
    }

    async findAll(): Promise<UserFullDto[]> {
        const users = await this.userRepository.find();
        return users.map(u => this.toUserFullDto(u));
    }

    private async findEntity(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
        throw new NotFoundException(`User avec l'id : ${id} introuvable`);
    }
    return user;
    }

    async findOne(id: number): Promise<UserDto> {
        const user = await this.userRepository.findOneBy({id});
        if (!user) {
            throw new NotFoundException(`User avec l' id : ${id} introuvable`);
        }
        return this.toUserDto(user);
    }


    async findOneByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({email});
    }

    async update(id: number, dto: UserUpdate): Promise<UserDto> {
        const user = await this.findEntity(id);        // throw le 404 si absent
        Object.assign(user, dto);             // n'écrase que les champs présents dans le dto
        return this.toUserDto(await this.userRepository.save(user));
    }

    async updateRole(id: number, dto: UpdateRoleDto): Promise<UserDto> {
        const user = await this.findEntity(id);        // throw le 404 si absent
        user.role = dto.role;             // n'écrase que les champs présents dans le dto
        return this.toUserDto(await this.userRepository.save(user));
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);                // vérifie l'existence (404 sinon)
        await this.userRepository.delete(id);
    }

    private toUserDto(user: User): UserDto {
        return {
            name: user.name,
            email: user.email,
            role : user.role
        };
    }

        private toUserFullDto(user: User): UserFullDto {
        return {
            id : user.id,
            name: user.name,
            email: user.email,
            role : user.role
        };
    }
}
