import { Test, TestingModule } from '@nestjs/testing';
import { BasketController } from './basket.controller';

describe('Basket Controller', () => {
  let controller: BasketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasketController],
    }).compile();

    controller = module.get<BasketController>(BasketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
