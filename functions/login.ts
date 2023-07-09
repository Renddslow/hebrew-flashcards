import { Handler } from '@netlify/functions';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const CURRENT_PASSWORD = process.env.CURRENT_PASSWORD;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

type Payload = {
  data: {
    type: 'token';
    attributes: {
      password: string;
    };
  };
};

const createError = (status, message, type) =>
  JSON.stringify({
    errors: [{ status, title: type, message }],
  });

const handler: Handler = async (event) => {
  if (!CURRENT_PASSWORD) {
    throw new Error('No password set');
  }

  const body: Payload = JSON.parse(event.body || '{}');
  const { data } = body;
  if (!data) {
    return {
      statusCode: 400,
      body: createError(400, 'No data provided', 'InvalidRequest'),
    };
  }

  if (!data.type || data.type !== 'token') {
    return {
      statusCode: 400,
      body: createError(400, `Expected type of "token", received "${data.type}"`, 'InvalidRequest'),
    };
  }

  if (!data.attributes || !data.attributes.password) {
    return {
      statusCode: 400,
      body: createError(400, 'No password provided', 'InvalidRequest'),
    };
  }

  if (data.attributes.password !== CURRENT_PASSWORD) {
    return {
      statusCode: 401,
      body: createError(401, 'Incorrect password', 'Unauthorized'),
    };
  }

  const token = jwt.sign({ message: 'שלום' }, COOKIE_SECRET, { expiresIn: '12w' });
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        type: 'token',
        meta: {
          message: 'Token created',
        },
      },
    }),
    headers: {
      'Set-Cookie': cookie.serialize('token', token),
    },
  };
};

export { handler };
