import { useMutation } from "@tanstack/react-query";
import { signUp as signUpAction } from "../actions/authActions";
import type { AuthResponse, SignUpDto } from "../types/auth.types";

export function useSignUp() {
  return useMutation<AuthResponse, Error, SignUpDto>({
    mutationFn: signUpAction,
  });
}
