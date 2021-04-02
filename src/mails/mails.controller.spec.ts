import { CACHE_MANAGER } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { MailsController } from './mails.controller';
import { MailsService } from './mails.service';

describe('MailsController', () => {
  let controller: MailsController;

  const mockService = {
    findAll: jest.fn(),
    validate: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailsController],
      providers: [
        MailsService,
        {
          provide: MailsService,
          useValue: mockService,
        },
        {
          provide: getQueueToken('mail'),
          useValue: mockQueue,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCache,
        },
      ],
    }).compile();

    controller = module.get<MailsController>(MailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('all', () => {
    it('should return all mails', async () => {
      const result = [];
      mockService.findAll.mockReturnValue(result);
      const sut = await controller.findAll();
      expect(sut).toBe(result);
    });
  });

  describe('validate', () => {
    it('should validate a mail the first time', async () => {
      const mail = 'valid@mail.com';
      const key = `mail-${mail}`;

      mockCache.get.mockReturnValue(false);
      mockService.validate.mockReturnValue(true);

      const sut = await controller.validate(mail);
      expect(mockCache.get).toBeCalledWith(key);
      expect(mockQueue.add).toBeCalledWith({ mail });
      expect(sut).toStrictEqual({ validation: true });
    });

    it('should return a cached mail validation', async () => {
      const mail = 'valid@mail.com';
      const key = `mail-${mail}`;

      mockCache.get.mockReturnValue(true);

      const sut = await controller.validate(mail);
      expect(mockCache.get).toBeCalledWith(key);
      expect(mockService.validate).not.toBeCalled();
      expect(mockCache.set).not.toBeCalled();
      expect(mockQueue.add).not.toBeCalled();
      expect(sut).toStrictEqual({ validation: true });
    });
  });
});
