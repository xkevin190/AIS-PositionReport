import { IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchVesselsDto {
  @IsArray()
  @ArrayMinSize(2)
  @Type(() => Number)
  bbox: number[][];
}