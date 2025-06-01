import { Controller, Get, Query } from '@nestjs/common';
import { VesselsService } from './vessels.service';
import { SearchVesselsDto } from './dto/search-vessels.dto';

@Controller('vessels')
export class VesselsController {
  constructor(private readonly vesselsService: VesselsService) {}

  @Get()
  findWithinBbox(@Query() query: SearchVesselsDto) {
    const bbox: number[][] = [
      [query.minLng, query.minLat],
      [query.maxLng, query.maxLat],
    ];
    return this.vesselsService.findFreshInBbox(bbox);
  }
}
