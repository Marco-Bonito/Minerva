
import { Request, Response, NextFunction } from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller';
import * as userService from '../services/user.service';
import { OK } from '../constants/httpStatus';

// Mock the user service
jest.mock('../services/user.service');

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
        params: {
            id: '1'
        }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should get all users and return them with a 200 status code', async () => {
      const users = [{ id: '1', name: 'Test User' }];
      (userService.getAllUsers as jest.Mock).mockResolvedValue(users);

      await getAllUsers(req as Request, res as Response, next);

      expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledWith(users);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call the next function with an error if the service throws one', async () => {
      const error = new Error('Test Error');
      (userService.getAllUsers as jest.Mock).mockRejectedValue(error);

      await getAllUsers(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserById', () => {
    it('should get a user by id and return it with a 200 status code', async () => {
      const user = { id: '1', name: 'Test User' };
      (userService.getUserById as jest.Mock).mockResolvedValue(user);

      await getUserById(req as Request, res as Response, next);

      expect(userService.getUserById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(OK);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call the next function with an error if the service throws one', async () => {
        const error = new Error('Test Error');
        (userService.getUserById as jest.Mock).mockRejectedValue(error);

        await getUserById(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
  });
});
