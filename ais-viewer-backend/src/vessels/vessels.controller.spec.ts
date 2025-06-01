import { Test, TestingModule } from '@nestjs/testing';
import { VesselsController } from './vessels.controller';
import { VesselsService } from './vessels.service';
import { SearchVesselsDto } from './dto/search-vessels.dto';

describe('VesselsController', () => {
  let controller: VesselsController;
  let vesselsService: VesselsService;

  const mockVesselsService = {
    findFreshInBbox: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VesselsController],
      providers: [
        {
          provide: VesselsService,
          useValue: mockVesselsService,
        },
      ],
    }).compile();

    controller = module.get<VesselsController>(VesselsController);
    vesselsService = module.get<VesselsService>(VesselsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call vesselsService.findFreshInBbox with correct bounding box', async () => {
    const query: SearchVesselsDto = {
      minLat: -10,
      minLng: -20,
      maxLat: 10,
      maxLng: 20,
    };

    const expectedBbox = [
      [-20, -10],
      [20, 10],
    ];

    const mockResult = [{ mmsi: 123456789, name: 'Test Vessel' }];
    mockVesselsService.findFreshInBbox.mockResolvedValue(mockResult);

    const result = await controller.findWithinBbox(query);

    expect(vesselsService.findFreshInBbox).toHaveBeenCalledWith(expectedBbox);
    expect(result).toEqual(mockResult);
  });
});
