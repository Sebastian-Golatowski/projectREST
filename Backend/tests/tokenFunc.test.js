import {
  tokenGetter,
  tokenMaker,
  userInfo,
  tokenMiddleware
} from '../backedLogic/tokenFunc.js';

import jwt from 'jsonwebtoken';

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('tokenFunc.js', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    process.env.JWT_SECRET = 'testsecret';
  });

  describe('tokenMaker()', () => {
    it('generuje token JWT z poprawnymi danymi', () => {
      jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token');

      const result = tokenMaker(1, 'user');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, username: 'user' },
        'testsecret',
        { expiresIn: '5h' }
      );
      expect(result).toBe('mocked-token');
    });
  });

  describe('tokenGetter()', () => {
    it('zwraca 401 jeśli brak nagłówka Authorization', () => {
      const req = { headers: {} };
      const res = mockRes();

      const result = tokenGetter(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid or missing Authorization header'
      });
      expect(result).toEqual(res);
    });

    it('zwraca 401 jeśli token pusty', () => {
      const req = { headers: { authorization: 'Bearer    ' } };
      const res = mockRes();

      const result = tokenGetter(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Bearer token is empty'
      });
      expect(result).toEqual(res);
    });

    it('zwraca 401 jeśli token jest niepoprawny', () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('bad token');
      });

      const req = { headers: { authorization: 'Bearer badtoken' } };
      const res = mockRes();

      const result = tokenGetter(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid or expired token'
      });
      expect(result).toEqual(res);
    });

    it('zwraca 401 jeśli token nie zawiera id lub username', () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({});

      const req = { headers: { authorization: 'Bearer token' } };
      const res = mockRes();

      const result = tokenGetter(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token missing required user info (id, username)'
      });
      expect(result).toEqual(res);
    });

    it('zwraca payload jeśli token jest poprawny', () => {
      const payload = { id: 1, username: 'user' };
      jest.spyOn(jwt, 'verify').mockReturnValue(payload);

      const req = { headers: { authorization: 'Bearer token' } };
      const res = mockRes();

      const result = tokenGetter(req, res);
      expect(result).toEqual(payload);
    });
  });

  describe('userInfo()', () => {
    it('zwraca dane użytkownika jeśli token poprawny', () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = {}; // no longer mocking res.json or res.status
      const payload = { id: 2, username: 'xyz' };
    
      jest.spyOn(jwt, 'verify').mockReturnValue(payload);
    
      const result = userInfo(req, res);

      expect(result.id).toEqual(payload.id);
      expect(result.username).toEqual(payload.username);
    });

    it('zwraca pusty obiekt jeśli token nieprawidłowy', () => {
      const req = { headers: { authorization: 'Bearer fail' } };
      const res = {}; // no need for mockRes now
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error();
      });
    
      const result = userInfo(req, res);
    
      expect(result).toEqual({});
      expect(result.id).toBeUndefined();
    });
  });

  describe('tokenMiddleware()', () => {
    it('ustawia userId i username, potem wywołuje next()', () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = mockRes();
      const next = jest.fn();

      jest.spyOn(jwt, 'verify').mockReturnValue({ id: 3, username: 'abc' });

      tokenMiddleware(req, res, next);

      expect(req.userId).toBe(3);
      expect(req.username).toBe('abc');
      expect(next).toHaveBeenCalled();
    });

    it('zwraca 401 jeśli token nieprawidłowy', () => {
      const req = { headers: { authorization: 'Bearer token' } };
      const res = mockRes();
      const next = jest.fn();

      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      tokenMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});