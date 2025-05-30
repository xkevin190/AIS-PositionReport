import { Module } from '@nestjs/common';
import { VesselsController } from './vessels.controller';
import { VesselsService } from './vessels.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vessel, VesselSchema } from './entities/vessel.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Vessel.name, schema: VesselSchema },
      ]),
    ],
  controllers: [VesselsController],
  providers: [VesselsService],
})
export class VesselsModule {}
