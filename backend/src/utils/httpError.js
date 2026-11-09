export class HttpError extends Error {
  constructor(status, message, code = 'request_failed', fields = undefined) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const badRequest = (message, fields, code = 'validation_failed') =>
  new HttpError(400, message, code, fields);

export const unauthorized = (message = 'You need to sign in to continue.') =>
  new HttpError(401, message, 'unauthorized');

export const forbidden = (message = 'You do not have permission to do that.', code = 'forbidden') =>
  new HttpError(403, message, code);

export const notFound = (message = 'Not found.', code = 'not_found') =>
  new HttpError(404, message, code);

export const conflict = (message, code = 'conflict') => new HttpError(409, message, code);
