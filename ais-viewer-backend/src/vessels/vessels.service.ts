import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vessel } from './entities/vessel.schema';
import { Model } from 'mongoose';

@Injectable()
export class VesselsService {
  constructor(
    @InjectModel(Vessel.name)
    private readonly vesselModel: Model<Vessel>,
  ) {}

  async findFreshInBbox(bbox: number[][]) {
    const [[minLng, minLat], [maxLng, maxLat]] = bbox;

    const bboxString = JSON.stringify(bbox);

    console.log(bboxString)

    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

    return null;

    // return this.vesselModel.find(
    //   {
    //     updatedAt: { $gte: twoMinutesAgo },
    //     location: {
    //       $geoWithin: {
    //         $box: [
    //           [minLng, minLat],
    //           [maxLng, maxLat],
    //         ],
    //       },
    //     },
    //   },
    //   { mmsi: 1, name: 1, location: 1, updatedAt: 1 },
    // );
  }
}
