import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MailsService } from './mails.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { Mail } from './schemas/mail.schema';

describe('MailsService', () => {
  let service: MailsService;

  const mockModel = {
    find: jest.fn().mockReturnThis(),
    create: jest.fn(),
    exec: jest.fn(),
    exists: jest.fn(),
  };

  const mockedMail: CreateMailDto = {
    mail: 'any@mail.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailsService,
        {
          provide: getModelToken(Mail.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<MailsService>(MailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new mail', async () => {
      mockModel.create.mockReturnValue(mockedMail);
      await service.create(mockedMail);
      expect(mockModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should list all mails', async () => {
      mockModel.exec.mockReturnValue([mockedMail, mockedMail]);
      const sut = await service.findAll();
      expect(sut).toHaveLength(2);
      expect(mockModel.find).toHaveBeenCalledTimes(1);
      expect(mockModel.exec).toHaveBeenCalledTimes(1);
    });
  });

  describe('exists', () => {
    it('should create a new mail', async () => {
      mockModel.exists.mockReturnValue(true);
      const sut = await service.exists(mockedMail.mail);
      expect(sut).toBeTruthy();
      expect(mockModel.exists).toHaveBeenCalledTimes(1);
      expect(mockModel.exists).toHaveBeenCalledWith({ mail: mockedMail.mail });
    });
  });
});
