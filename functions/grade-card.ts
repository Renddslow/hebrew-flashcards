import { Handler } from '@netlify/functions';
import { klona } from 'klona';
import { z } from 'zod';

const StoredCardSchema = z
  .object({
    easinessFactor: z.number({
      required_error: 'Easiness factor is required (data.attributes.easinessFactor)',
    }),
    interval: z.number({
      required_error: 'Interval is required (data.attributes.interval)',
    }),
    repetitions: z.number({
      required_error: 'Repetitions is required (data.attributes.repetitions)',
    }),
    nextPracticeDate: z.date({
      required_error: 'Next practice date is required (data.attributes.nextPracticeDate)',
    }),
    front: z.string({
      required_error: 'Data for the front of the card is required (data.attributes.front)',
    }),
    back: z.string({
      required_error: 'Data for the back of the card is required (data.attributes.back)',
    }),
  })
  .required();

const PayloadSchema = z.object({
  data: z
    .object({
      id: z.string({
        required_error: 'ID is required (data.id)',
      }),
      type: z.literal('card', {
        required_error: 'Type must be "card" (data.type)',
      }),
      attributes: StoredCardSchema,
      relationships: z.object(
        {
          grade: z.object(
            {
              type: z.literal('grade', {
                required_error: 'Type must be "grade" (data.relationships.grade.type)',
              }),
              id: z.number({
                required_error: 'Grade ID is required (data.relationships.grade.id)',
              }),
            },
            {
              required_error: 'Grade is required (data.relationships.grade)',
            },
          ),
        },
        {
          required_error: 'Relationships are required (data.relationships)',
        },
      ),
    })
    .required(),
});

type Payload = z.infer<typeof PayloadSchema>;

const createError = (status, message, type) =>
  JSON.stringify({
    errors: [{ status, title: type, message }],
  });

const convertPayloadForDate = (payload: Payload) => {
  const data = klona(payload);
  data.data.attributes.nextPracticeDate = new Date(data.data.attributes.nextPracticeDate);
  return data;
};

const handler: Handler = async (event, context) => {
  const payload: Payload = convertPayloadForDate(JSON.parse(event.body));

  if (!payload.data) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: createError(400, 'No data provided', 'InvalidRequest'),
    };
  }

  const { attributes } = payload.data;

  if (!attributes) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: createError(400, 'No attributes provided', 'InvalidRequest'),
    };
  }

  try {
    PayloadSchema.parse(payload);
  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        e.issues
          .map((issue) => createError(400, issue.message, 'InvalidRequestBody'))
          .map((t) => JSON.parse(t))
          .reduce((acc, issue) => ({ errors: [...acc.errors, ...issue.errors] }), {
            errors: [],
          }),
      ),
    };
  }

  return {
    statusCode: 200,
  };
};

export { handler };
