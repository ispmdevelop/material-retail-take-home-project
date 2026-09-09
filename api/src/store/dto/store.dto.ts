import { IsUUID, IsInt, Min } from 'class-validator';

export class PurchaseDto {
  @IsUUID()
  productItemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
