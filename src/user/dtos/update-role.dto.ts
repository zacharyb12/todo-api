// dtos/update-role.dto.ts
import { IsIn } from 'class-validator';

export class UpdateRoleDto {
  @IsIn(['user', 'admin'])
  role: string;
}