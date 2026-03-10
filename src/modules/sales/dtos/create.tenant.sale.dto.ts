import { IsNotEmpty, IsNumber} from "class-validator";

export class CreateTenantSaleDto{
  @IsNotEmpty()
  @IsNumber()
  amountMade: number;
}