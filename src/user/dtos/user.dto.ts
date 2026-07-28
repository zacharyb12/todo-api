import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class UserDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name : string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    email : string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    role : string;

}