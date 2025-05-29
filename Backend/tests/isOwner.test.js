import { isOwner } from '../backedLogic/isOwner.js';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mBook = {
    findFirst: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => ({
      book: mBook
    }))
  };
});

describe('isOwner()', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  it('zwraca true jeśli użytkownik jest właścicielem', async () => {
    prisma.book.findFirst.mockResolvedValue({ id: 1, userId: 1 });
    const result = await isOwner(1, 1);
    expect(result).toBe(true);
  });

  it('zwraca false jeśli użytkownik nie jest właścicielem', async () => {
    prisma.book.findFirst.mockResolvedValue(null);
    const result = await isOwner(1, 2);
    expect(result).toBe(false);
  });
});
