import { User } from '~/src/types/User';

export enum AuthenticationProviders {
  GOOGLE = 'GOOGLE',
}

export interface AuthenticationProviderProps {
  isSubmitting: boolean;
  onError(errorMessage: string): void;
  onStart(): void;
  onSuccess(user: User, provider: AuthenticationProviders): void;
}
