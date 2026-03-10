import { IsNotEmpty, IsNumber} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTenantSaleDto{
  @ApiProperty({description: "The amount of sale made", example: 500000})
  @IsNotEmpty()
  @IsNumber()
  amountMade: number;
}