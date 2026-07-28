import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, IsPositive } from "class-validator";

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;
  
  
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

}