import { Test, TestingModule } from '@nestjs/testing';
import { AisService } from './ais.service';
import { getModelToken } from '@nestjs/mongoose';
import { Vessel } from '../vessels/entities/vessel.schema';
import { Model } from 'mongoose';

describe('AisService', () => {
  let service: AisService;
  let vesselModel: jest.Mocked<Model<Vessel>>;

  beforeEach(async () => {
    const mockVesselModel = {
      updateOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AisService,
        {
          provide: getModelToken(Vessel.name),
          useValue: mockVesselModel,
        },
      ],
    }).compile();

    service = module.get<AisService>(AisService);
    vesselModel = module.get(getModelToken(Vessel.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should skip processing if MetaData is incomplete', async () => {
    await service.handlePositionReport({}); // no MetaData

    expect(vesselModel.updateOne).not.toHaveBeenCalled();

    await service.handlePositionReport({
      MetaData: { MMSI: null, latitude: 1, longitude: 1 },
    });

    expect(vesselModel.updateOne).not.toHaveBeenCalled();
  });

  it('should call updateOne with correct parameters', async () => {
    const input = {
      MetaData: {
        MMSI: 123456789,
        ShipName: 'Test Vessel',
        latitude: 10,
        longitude: 20,
        time_utc: '2024-01-01T00:00:00Z',
      },
      Message: {
        PositionReport: {
          Cog: 270,
        },
      },
    };

    await service.handlePositionReport(input);

    expect(vesselModel.updateOne).toHaveBeenCalledWith(
      { mmsi: 123456789 },
      {
        $set: {
          mmsi: 123456789,
          name: 'Test Vessel',
          location: {
            type: 'Point',
            coordinates: [20, 10],
          },
          course: 270,
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        },
      },
      { upsert: true },
    );
  });

});
