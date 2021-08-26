import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './create-cat.dto';
import { Cat } from './cat.schema';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  const cats: Cat[] = [
    { name: 'cat1', breed: 'breed1', age: 1 },
    { name: 'cat2', breed: 'breed2', age: 2 },
    { name: 'cat3', breed: 'breed3', age: 3 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((createCatDto: CreateCatDto) =>
                Promise.resolve({ ...createCatDto }),
              ),
            findAll: jest.fn().mockResolvedValue(cats),
          },
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get an array of cats', () => {
    expect(controller.findAll()).resolves.toEqual([cats]);
  });

  it('should create a cat', () => {
    const cat = cats[0];
    expect(controller.create(cat)).resolves.toEqual(cat);
  });
});
