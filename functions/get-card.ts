import { Handler } from '@netlify/functions';
import { parse as parseCookie } from 'cookie';
import jwt from 'jsonwebtoken';

const COOKIE_SECRET = process.env.COOKIE_SECRET;

const safeVerify = (token: string) => {
  try {
    return jwt.verify(token, COOKIE_SECRET);
  } catch (e) {
    return null;
  }
};

const handler: Handler = async (event) => {
  const cookie = event.headers.cookie;
  const parsedCookie = parseCookie(cookie || '');
  const token = parsedCookie['token'];

  if (!token || !safeVerify(token)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      meta: {
        message: 'All caught up!',
      },
      data: null,
    }),
  };
};

export { handler };
