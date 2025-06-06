import {
  search,
  assigne,
  deAssigne,
  userBooks
} from '../controllers/bookControler.js';

import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { isOwner } from '../backedLogic/isOwner.js';

jest.mock('axios');
jest.mock('../backedLogic/isOwner.js', () => ({
  isOwner: jest.fn()
}));
jest.mock('@prisma/client', () => {
  const mBook = {
    findFirst: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn()
  };
  const mNote = {
    create: jest.fn()
  };
  return {
    PrismaClient: jest.fn(() => ({
      book: mBook,
      note: mNote
    }))
  };
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('bookController', () => {
  let res;
  let prisma;

  beforeEach(() => {
    res = mockRes();
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('search()', () => {
    it('zwraca 400 gdy brak parametru title', async () => {
      const req = { params: {} };
      await search(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('zwraca listę książek z Google API', async () => {
      const req = { params: { title: 'Harry Potter' } };
      axios.get.mockResolvedValue({
        data: {
          items: [
            {
              id: '123',
              volumeInfo: {
                title: 'Harry Potter',
                language: 'en',
                authors: ['J.K. Rowling'],
                imageLinks: { thumbnail: 'url' },
                averageRating: 4,
                description: 'desc',
                ratingsCount: 1000
              }
            }
          ]
        }
      });

      await search(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('assigne()', () => {
    it('zwraca 400 jeśli brak googleId', async () => {
      const req = { body: {}, userId: 1 };
      await assigne(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('zwraca 401 jeśli brak userId', async () => {
      const req = { body: { googleId: 'xyz' } };
      await assigne(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('zwraca 409 jeśli książka już istnieje', async () => {
      prisma.book.findFirst.mockResolvedValue({ id: 1 });
      axios.get.mockResolvedValue({ status: 200 });

      const req = { body: { googleId: 'xyz' }, userId: 1 };
      await assigne(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it('tworzy książkę i notatkę jeśli wszystko jest ok', async () => {
      prisma.book.findFirst.mockResolvedValue(null);
      axios.get.mockResolvedValue({ status: 200 });
      prisma.book.create.mockResolvedValue({ id: 10 });
      prisma.note.create.mockResolvedValue({});

      const req = { body: { googleId: 'xyz' }, userId: 1 };
      await assigne(req, res);

      expect(prisma.book.create).toHaveBeenCalled();
      expect(prisma.note.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('zwraca 404 jeśli Google API zwraca błąd', async () => {
      axios.get.mockResolvedValue({ status: 404 });

      const req = { body: { googleId: 'fail' }, userId: 1 };
      await assigne(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deAssigne()', () => {
    it('zwraca 401 jeśli brak userId', async () => {
      const req = { params: { bookId: 1 } };
      await deAssigne(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('zwraca 404 jeśli książka nie istnieje', async () => {
      prisma.book.findFirst.mockResolvedValue(null);
      const req = { params: { bookId: 1 }, userId: 1 };

      await deAssigne(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('zwraca 403 jeśli użytkownik nie jest właścicielem', async () => {
      prisma.book.findFirst.mockResolvedValue({ id: 1 });
      isOwner.mockReturnValue(false); 

      const req = { params: { bookId: 1 }, userId: 1 };
      await deAssigne(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "User is not owner" });
    });

    it('usuwa książkę jeśli user jest właścicielem', async () => {
      prisma.book.findFirst.mockResolvedValue({ id: 1 });
      isOwner.mockReturnValue(true);
      prisma.book.deleteMany.mockResolvedValue({});

      const req = { params: { bookId: 1 }, userId: 1 };
      await deAssigne(req, res);

      expect(prisma.book.deleteMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('userBooks()', () => {
    it('zwraca 401 jeśli brak userId', async () => {
      const req = {};
      await userBooks(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('zwraca listę książek użytkownika', async () => {
      prisma.book.findMany.mockResolvedValue([
        { id: 1, googleId: 'abc' }
      ]);

      axios.get.mockResolvedValue({
        data: {
          id: 'abc',
          volumeInfo: {
            title: 'Test Book',
            authors: ['Author'],
            imageLinks: { thumbnail: 'thumb' },
            averageRating: 5,
            description: 'desc',
            ratingsCount: 99
          }
        }
      });

      const req = { userId: 1 };
      await userBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
