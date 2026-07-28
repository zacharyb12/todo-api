import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class UserUpdate {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name : string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    email : string;

}