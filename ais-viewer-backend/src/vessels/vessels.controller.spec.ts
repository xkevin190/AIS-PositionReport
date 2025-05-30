import { Test, TestingModule } from '@nestjs/testing';
import { VesselsController } from './vessels.controller';

describe('VesselsController', () => {
  let controller: VesselsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VesselsController],
    }).compile();

    controller = module.get<VesselsController>(VesselsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
