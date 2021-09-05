import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { getModelToken } from '@nestjs/mongoose';
import { CatDocument, Cat } from './cat.schema';
import { createMock } from '@golevelup/nestjs-testing';
import { Model, Query, QueryWithHelpers } from 'mongoose';
import { ICat } from './cat.interface';

const lasagna = 'lasagna lover';

// I'm lazy and like to have functions that can be re-used to deal with a lot of my initialization/creation logic
const mockCat = (
  name = 'Ventus',
  id = 'a uuid',
  age = 4,
  breed = 'Russian Blue',
): ICat => ({
  name,
  id,
  age,
  breed,
});

// still lazy, but this time using an object instead of multiple parameters
const mockCatDoc = (mock?: Partial<ICat>): Partial<CatDocument> => ({
  name: mock?.name || 'Ventus',
  _id: mock?.id || 'a uuid',
  age: mock?.age || 4,
  breed: mock?.breed || 'Russian Blue',
});

const catArray = [
  mockCat(),
  mockCat('Vitani', 'a new uuid', 2, 'Tabby'),
  mockCat('Simba', 'the king', 14, 'Lion'),
];

const catDocArray = [
  mockCatDoc(),
  mockCatDoc({ name: 'Vitani', id: 'a new uuid', age: 2, breed: 'Tabby' }),
  mockCatDoc({ name: 'Simba', age: 14, id: 'the king', breed: 'Lion' }),
];

describe('CatService', () => {
  let service: CatsService;
  let model: Model<CatDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getModelToken(Cat.name),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockCat()),
            constructor: jest.fn().mockResolvedValue(mockCat()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    model = module.get<Model<CatDocument>>(getModelToken(Cat.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all cats', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(catDocArray),
    } as any);
    const cats = await service.findAll();
    expect(cats).toEqual(catArray);
  });

  it('should insert a new cat', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        _id: 'some id',
        name: 'Oliver',
        age: 1,
        breed: 'Tabby',
      }),
    );
    const newCat = await service.create({
      name: 'Oliver',
      age: 1,
      breed: 'Tabby',
    });
    expect(newCat).toEqual(mockCat('Oliver', 'some id', 1, 'Tabby'));
  });
  // jest is complaining about findOneAndUpdate. Can't say why at the moment.
  it('should update a cat successfully', async () => {
    const cat = { id: lasagna, name: 'Garfield', breed: 'Tabby', age: 42 };
    jest
      .spyOn(model, 'findOneAndUpdate')
      .mockResolvedValue(mockCatDoc(cat) as any);
    const updatedCat = await service.update(cat);
    expect(updatedCat).toEqual(mockCat('Garfield', lasagna, 42, 'Tabby'));
  });
  // it('should delete a cat successfully', async () => {
  //   // really just returning a truthy value here as we aren't doing any logic with the return
  //   jest.spyOn(model, 'remove').mockResolvedValueOnce(true as any);
  //   expect(await service.deleteOne('a bad id')).toEqual({ deleted: true });
  // });
  // it('should not delete a cat', async () => {
  //   // really just returning a falsy value here as we aren't doing any logic with the return
  //   jest.spyOn(model, 'remove').mockRejectedValueOnce(new Error('Bad delete'));
  //   expect(await service.deleteOne('a bad id')).toEqual({
  //     deleted: false,
  //     message: 'Bad delete',
  //   });
  // });
});
