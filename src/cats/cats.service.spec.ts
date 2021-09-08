import { Test, TestingModule } from "@nestjs/testing";
import { CatsService } from "./cats.service";
import { getModelToken } from "@nestjs/mongoose";
import { ICat } from "./cat.interface";
import { createMock } from "@golevelup/nestjs-testing";
import { Model, Query } from "mongoose";
import { Cat, CatDocument } from "./cat.schema";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

const mockICats: ICat[] = [
  {
    id: "id1",
    name: "cat1",
    age: 1,
    breed: "breed1",
  },
  {
    id: "id2",
    name: "cat2",
    age: 2,
    breed: "breed2",
  },
];
const mockCatDoc = (mock: Partial<ICat>): Partial<CatDocument> => ({
  name: mock?.name,
  _id: mock?.id,
  age: mock?.age,
  breed: mock?.breed,
  toInterface: jest.fn().mockReturnValue(mock),
});

const mockCatDocuments = mockICats.map((cat) => mockCatDoc(cat));

describe("CatService", () => {
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
            new: jest.fn(),
            constructor: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            exec: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            child: jest.fn().mockResolvedValue({
              defaultMeta: {},
              error: jest.fn(),
            }),
            defaultMeta: {},
          },
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    model = module.get<Model<CatDocument>>(getModelToken(Cat.name));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all cats", async () => {
    jest.spyOn(model, "find").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockCatDocuments),
    } as any);
    const cats = await service.findAll();
    expect(cats).toEqual(mockICats);
  });
});
