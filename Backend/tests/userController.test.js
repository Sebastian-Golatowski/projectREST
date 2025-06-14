import { register, login, me } from '../controllers/userControler.js';
import bcrypt from 'bcryptjs';
import { tokenMaker, userInfo  } from '../backedLogic/tokenFunc.js';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  const mUser = {
    findFirst: jest.fn(),
    create: jest.fn()
  };
  return { PrismaClient: jest.fn(() => ({ user: mUser })) };
});

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn(),
}));

jest.mock('../backedLogic/tokenFunc.js', () => ({
  tokenMaker: jest.fn(),
  userInfo: jest.fn()
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('register()', () => {
  let res;
  let prisma;

  beforeEach(() => {
    res = mockRes();
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  it('zwraca 400 jeśli brakuje danych wejściowych', async () => {
    const req = { body: {} };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username, password and password confirmation are required"
    });
  });

  it('zwraca 409 jeśli użytkownik istnieje', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 1, username: "test" });

    const req = { body: { username: "test", password: "Haslo123!", secPassword: "Haslo123!" } };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username is already taken"
    });
  });

  it('zwraca 400 jeśli hasła się nie zgadzają', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    const req = { body: { username: "newuser", password: "Haslo123!", secPassword: "Haslo1234!" } };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Passwords do not match"
    });
  });

  it('zwraca 400 jeśli hasło nie spełnia wymagań', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    const req = { body: { username: "newuser", password: "abc", secPassword: "abc" } };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password does not meet the requirements"
    });
  });

  it('zwraca 201 i token jeśli rejestracja jest poprawna', async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    bcrypt.hashSync.mockReturnValue("hashedPassword");
    prisma.user.create.mockResolvedValue({ id: 123, username: "newuser" });
    tokenMaker.mockReturnValue("mockedToken");

    const req = {
      body: {
        username: "newuser",
        password: "Haslo123!",
        secPassword: "Haslo123!"
      }
    };

    await register(req, res);

    expect(bcrypt.hashSync).toHaveBeenCalledWith("Haslo123!", 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: "newuser",
        password: "hashedPassword"
      }
    });
    expect(tokenMaker).toHaveBeenCalledWith(123, "newuser");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User created successfully",
      token: "mockedToken"
    });
  });
});

describe('login()', () => {
  let res;
  let prisma;

  beforeEach(() => {
    res = mockRes();
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  it('zwraca 400 jeśli brakuje username lub password', async () => {
    const req = { body: {} };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Username and password are required"
    });
  });

  it('zwraca 401 jeśli użytkownik nie istnieje', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    const req = { body: { username: "ghost", password: "pass" } };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid username or password"
    });
  });

  it('zwraca 401 jeśli hasło jest nieprawidłowe', async () => {
    prisma.user.findFirst.mockResolvedValue({ username: "test", password: "hashedpass" });
    bcrypt.compareSync.mockReturnValue(false);

    const req = { body: { username: "test", password: "wrongpass" } };

    await login(req, res);

    expect(bcrypt.compareSync).toHaveBeenCalledWith("wrongpass", "hashedpass");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid username or password"
    });
  });

  it('zwraca 200 i token jeśli login jest poprawny', async () => {
    const user = { id: 1, username: "test", password: "hashedpass" };
    prisma.user.findFirst.mockResolvedValue(user);
    bcrypt.compareSync.mockReturnValue(true);
    tokenMaker.mockReturnValue("valid-token");

    const req = { body: { username: "test", password: "correctpass" } };

    await login(req, res);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { username: "test" }
    });

    expect(bcrypt.compareSync).toHaveBeenCalledWith("correctpass", "hashedpass");
    expect(tokenMaker).toHaveBeenCalledWith(user.id, user.username);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      token: "valid-token"
    });
  });
});

describe('me()', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('zwraca 200 i dane użytkownika jeśli token jest poprawny', async () => {
    userInfo.mockResolvedValue({ id: 1, username: 'testuser' });

    const req = {};

    await me(req, res);

    expect(userInfo).toHaveBeenCalledWith(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      username: 'testuser'
    });
  });

  it('nie zwraca nic jeśli token jest niepoprawny (brak id)', async () => {
    userInfo.mockResolvedValue({});

    const req = {};

    await me(req, res);

    expect(userInfo).toHaveBeenCalledWith(req, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});