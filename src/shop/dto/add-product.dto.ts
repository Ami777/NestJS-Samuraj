import {IsNumber, IsString} from "class-validator";

export class AddProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;
}