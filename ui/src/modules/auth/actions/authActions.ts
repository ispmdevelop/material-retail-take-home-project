import { api } from '@/lib/api';
import type { AuthResponse, LoginDto, SignUpDto } from '../types/auth.types';

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', dto);
  return data;
}

export async function signUp(dto: SignUpDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signup', dto);
  return data;
}
