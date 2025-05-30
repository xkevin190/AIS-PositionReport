import { Module } from '@nestjs/common';
import { AisModule } from './ais/ais.module';
import { VesselsModule } from './vessels/vessels.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AisModule,
    VesselsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
})
export class AppModule {}
