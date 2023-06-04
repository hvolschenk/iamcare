import { APIValidationError } from '~/src/types/APIValidationError';

const parseErrors = <D extends {}>(
  rawErrorBody: APIValidationError<D>,
): Record<string, string> =>
  Object.keys(rawErrorBody.errors)
    .filter((fieldName) => rawErrorBody.errors[fieldName as keyof D].length > 0)
    .reduce(
      (accumulator, fieldName) => ({
        ...accumulator,
        [fieldName]: rawErrorBody.errors[fieldName as keyof D][0],
      }),
      {},
    );

export default parseErrors;
