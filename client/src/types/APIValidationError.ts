export interface APIValidationError<F extends {}> {
  errors: Record<keyof F, string[]>;
  message: string;
}
