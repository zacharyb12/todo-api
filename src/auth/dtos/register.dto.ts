import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class Register {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    email : string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    password : string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name : string;

}