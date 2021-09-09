import { Test, TestingModule } from "@nestjs/testing";
import { CatsService } from "./cats.service";
import { getModelToken } from "@nestjs/mongoose";
import { ICat } from "./cat.interface";
import { Model } from "mongoose";
import { Cat, CatDocument } from "./cat.schema";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCatDto } from "./create-cat.dto";

const mockICats: ICat[] = [
  {
    id: "id1",
    name: "cat1",
    age: 5,
    breed: "breed1",
  },
  {
    id: "id2",
    name: "cat2",
    age: 6,
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
            child: jest.fn().mockReturnValue({
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe("findAll", () => {
    it("findAll should return all cats", async () => {
      jest.spyOn(model, "find").mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockCatDocuments),
      } as any);
      const cats = await service.findAll();
      expect(cats).toEqual(mockICats);
    });
    it("findAll should throw when database error", async () => {
      jest.spyOn(model, "find").mockReturnValue({
        exec: jest.fn().mockRejectedValueOnce(new Error()),
      } as any);
      await expect(async () => {
        await service.findAll();
      }).rejects.toThrowError(InternalServerErrorException);
    });
    it("findAll should return empty array if database returned null", async () => {
      jest.spyOn(model, "find").mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      const cats = await service.findAll();
      expect(cats).toEqual([]);
    });
  });

  describe("findById", () => {
    it("findById should return a cat", async () => {
      jest.spyOn(model, "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockCatDocuments[0]),
      } as any);
      const cats = await service.findOneById("id1");
      expect(cats).toEqual(mockICats[0]);
    });
    it("findById should throw if the id doesn't exists", async () => {
      jest.spyOn(model, "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(async () => {
        await service.findOneById("id1");
      }).rejects.toThrowError(NotFoundException);
    });
    it("findById should throw if the id is not a string", async () => {
      await expect(async () => {
        //@ts-ignore
        await service.findOneById(1);
      }).rejects.toThrowError(BadRequestException);
    });
    it("findById should throw when database error", async () => {
      jest.spyOn(model, "findOne").mockReturnValue({
        exec: jest.fn().mockRejectedValueOnce(new Error()),
      } as any);
      await expect(async () => {
        await service.findOneById("id1");
      }).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe("create", () => {
    let createCatDto: CreateCatDto;
    beforeEach(async () => {
      createCatDto = { ...mockICats[0] };
      delete createCatDto["id"];
    });
    it("create should throw if invalid breed", async () => {
      createCatDto.breed = "invalid";
      await expect(async () => {
        await service.create(createCatDto);
      }).rejects.toThrowError(BadRequestException);
    });
    it("create should throw if name is too short", async () => {
      createCatDto.name = "a";
      await expect(async () => {
        await service.create(createCatDto);
      }).rejects.toThrowError(BadRequestException);
    });
    it("create should throw if name is too long", async () => {
      createCatDto.name = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"; // 31
      await expect(async () => {
        await service.create(createCatDto);
      }).rejects.toThrowError(BadRequestException);
    });
    it("create should throw if name is empty", async () => {
      createCatDto.name = "";
      await expect(async () => {
        await service.create(createCatDto);
      }).rejects.toThrowError(BadRequestException);
    });
    it("create should throw if database error", async () => {
      jest.spyOn(model, "create").mockImplementation(() => {
        return new Error();
      });
      await expect(async () => {
        await service.create(createCatDto);
      }).rejects.toThrowError(InternalServerErrorException);
    });
    it("create should return a cat when succeed", async () => {
      jest.spyOn(model, "create").mockImplementation(() => {
        return mockCatDocuments[0];
      });
      const cat = await service.create(createCatDto);
      expect(cat).toEqual({ ...mockICats[0] });
    });
  });
});
