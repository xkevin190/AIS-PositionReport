import { Test, TestingModule } from '@nestjs/testing';
import { VesselsService } from './vessels.service';
import { getModelToken } from '@nestjs/mongoose';
import { Vessel } from './entities/vessel.schema';
import { Model } from 'mongoose';

describe('VesselsService', () => {
  let service: VesselsService;
  let vesselModel: jest.Mocked<Model<Vessel>>;

  beforeEach(async () => {
    const mockModel = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VesselsService,
        {
          provide: getModelToken(Vessel.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<VesselsService>(VesselsService);
    vesselModel = module.get(getModelToken(Vessel.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call vesselModel.find with correct filter and projection', async () => {
    const bbox = [
      [-10, -20],
      [10, 20],
    ];
  
    const fixedNow = new Date('2025-06-01T18:33:00.000Z');
    jest.spyOn(Date, 'now').mockReturnValue(fixedNow.getTime());
  
  
    const mockResult = [
      {
        mmsi: 123456789,
        name: 'Test Vessel',
        location: { type: 'Point', coordinates: [5, 5] },
        updatedAt: fixedNow,
        course: 180,
      },
    ];
  
    vesselModel.find.mockResolvedValue(mockResult);
  
    const result = await service.findFreshInBbox(bbox);
  
    expect(vesselModel.find).toHaveBeenCalled()
    expect(result).toEqual(mockResult);
    
  });
})