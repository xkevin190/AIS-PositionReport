import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vessel } from '../vessels/entities/vessel.schema';

@Injectable()
export class AisService {
  private readonly logger = new Logger(AisService.name);

  constructor(
    @InjectModel(Vessel.name)
    private readonly vesselModel: Model<Vessel>,
  ) {}

  async handlePositionReport(values: any): Promise<void> {
    
    const meta = values.MetaData;
    if (!meta?.MMSI || !meta.latitude || !meta.longitude) return;

    try {
      await this.vesselModel.updateOne(
        { mmsi: meta.MMSI },
        {
          $set: {
            mmsi: meta.MMSI,
            name: meta.ShipName,
            location: {
              type: 'Point',
              coordinates: [meta.longitude, meta.latitude],
            },
            course: values.Message.PositionReport?.Cog ?? null,
            updatedAt: new Date(meta.time_utc),
          },
        },
        { upsert: true },
      );
    } catch (error) {
      this.logger.error(`Failed to save vessel ${meta.MMSI}`, error);
    }
  }
}
