import { Module } from '@nestjs/common';
import { AisService } from './ais.service';
import { AisGateway } from './ais.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Vessel, VesselSchema } from 'vessels/entities/vessel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vessel.name, schema: VesselSchema },
    ]),
  ],
  providers: [AisService, AisGateway],
})
export class AisModule {}
