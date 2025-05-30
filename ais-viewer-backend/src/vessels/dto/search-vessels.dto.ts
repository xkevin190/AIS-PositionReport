import { Type } from 'class-transformer';

export class SearchVesselsDto {
  @Type(() => Number)
  minLat: number;

  @Type(() => Number)
  minLng: number;

  @Type(() => Number)
  maxLat: number;

  @Type(() => Number)
  maxLng: number;
}