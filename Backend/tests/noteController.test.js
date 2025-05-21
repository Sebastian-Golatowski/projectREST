import { edit, getNote  } from '../controllers/noteControler.js';
import { PrismaClient } from '@prisma/client';
import { isOwner } from '../backedLogic/isOwner.js';

jest.mock('@prisma/client', () => {
  const mNote = {
    findMany: jest.fn(),
    updateMany: jest.fn(),
    findFirst: jest.fn(),
  };
  const mBook = {
    findFirst: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => ({
      note: mNote,
      book: mBook
    }))
  };
});

jest.mock('../backedLogic/isOwner.js', () => ({
  isOwner: jest.fn()
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('edit()', () => {
  let res;
  let prisma;

  beforeEach(() => {
    res = mockRes();
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  it('zwraca 401 gdy brak userId', async () => {
    const req = { body: { body: 'nowa notatka', bookId: 1 } };

    await edit(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing user ID" });
  });

  it('zwraca 400 gdy brak treści notatki (body)', async () => {
    const req = { body: { bookId: 1 }, userId: 1 };

    await edit(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Note content (body) is required" });
  });

  it('zwraca 400 gdy brak bookId', async () => {
    const req = { body: { body: 'nowa treść' }, userId: 1 };

    await edit(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing bookId" });
  });

  it('zwraca 403 gdy użytkownik nie jest właścicielem', async () => {
    isOwner.mockImplementation(() => {
      res.status(403).json({ message: "User is not owner" });
      return false;
    });

    const req = { body: { body: 'tekst', bookId: 1 }, userId: 1 };

    await edit(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "User is not owner" });
  });

  it('zwraca 404 jeśli brak notatki', async () => {
    isOwner.mockReturnValue(true);
    prisma.note.findMany.mockResolvedValue([]);

    const req = { body: { body: 'tekst', bookId: 1 }, userId: 1 };

    await edit(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Note not found" });
  });

  it('zwraca 200 jeśli notatka została zaktualizowana', async () => {
    isOwner.mockReturnValue(true);
    prisma.note.findMany.mockResolvedValue([{ id: 123, body: 'stara' }]);
    prisma.note.updateMany.mockResolvedValue({});

    const req = { body: { body: 'nowa treść', bookId: 1 }, userId: 1 };

    await edit(req, res);

    expect(prisma.note.updateMany).toHaveBeenCalledWith({
      where: { bookId: 1 },
      data: { body: 'nowa treść' }
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Note updated successfully" });
  });
});


describe('getNote()', () => {
  let res;
  let prisma;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  it('zwraca 400 jeśli brakuje bookId', async () => {
    const req = { params: {} };

    await getNote(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing bookId parameter"
    });
  });

  it('zwraca 404 jeśli książka nie istnieje', async () => {
    prisma.book.findFirst.mockResolvedValue(null);

    const req = { params: { bookId: 1 } };

    await getNote(req, res);

    expect(prisma.book.findFirst).toHaveBeenCalledWith({
      where: { id: 1 }
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Book not found"
    });
  });

  it('zwraca 404 jeśli notatka nie istnieje', async () => {
    prisma.book.findFirst.mockResolvedValue({ id: 1 });
    prisma.note.findFirst.mockResolvedValue(null);

    const req = { params: { bookId: 1 } };

    await getNote(req, res);

    expect(prisma.note.findFirst).toHaveBeenCalledWith({
      where: { bookId: 1 }
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Note not found"
    });
  });

  it('zwraca 200 i notatkę jeśli wszystko jest ok', async () => {
    const mockNote = { id: 101, body: "Testowa treść", bookId: 1 };
    prisma.book.findFirst.mockResolvedValue({ id: 1 });
    prisma.note.findFirst.mockResolvedValue(mockNote);

    const req = { params: { bookId: 1 } };

    await getNote(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ note: mockNote });
  });
});