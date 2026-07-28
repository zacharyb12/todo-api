import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class Login {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    email : string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    password : string;

}