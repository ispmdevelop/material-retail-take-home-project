import { IsString, IsOptional, IsNumber, Min, IsInt, IsObject, IsUUID } from 'class-validator';

export class CreateProductItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsObject()
  variants?: Record<string, string>;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  @Min(0)
  stockAlertBelow: number;
}

export class UpdateProductItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsObject()
  variants?: Record<string, string>;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockAlertBelow?: number;
}
