/* eslint-disable prettier/prettier */
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockUser = {
  username: 'Ariel',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  // let tasksRepository: TasksRepository;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('call TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('call TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test Title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksRepository.findOne('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('call TasksRepository.findOne and and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksRepository.findOne('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskById', () => {
    it('call TasksRepository.save and save the result', async () => {
      const mockBeforeTask = {
        title: 'Test Title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      const mockAfterTask = {
        title: 'Test Title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.IN_PROGRESS,
      };
      const id = 'someId';
      const status = TaskStatus.IN_PROGRESS;

      tasksRepository.findOne.mockResolvedValue(mockBeforeTask);
      const task = await tasksRepository.findOne(id, mockUser);

      task.status = status;
      tasksRepository.save.mockResolvedValue(task);

      const result = await tasksRepository.save(task);
      tasksRepository.save.mockResolvedValue(mockAfterTask);

      expect(result).toEqual(mockAfterTask);
    });
  });
});
