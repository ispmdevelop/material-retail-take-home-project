import { useMutation } from '@tanstack/react-query';
import { login as loginAction } from '../actions/authActions';
import type { AuthResponse, LoginDto } from '../types/auth.types';

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: loginAction,
  });
}
