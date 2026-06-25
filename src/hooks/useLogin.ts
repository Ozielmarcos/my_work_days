import { login as loginService } from '@/services/loginService';
import type { LoginResponse } from '@/types';
import { useCallback, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<LoginResponse | null>(null);
    const { setTokens } = useAuthStore()

    const doLogin = useCallback(
        async (email: string, password: string): Promise<LoginResponse> => {
            setLoading(true);
            setError(null);
            try {
                const data = await loginService(email, password);
                setUser(data);

                setTokens(data.token, data.refresh_token);
                return data;
            } catch (err) {
                setError(err as string);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setTokens]
    );

    return { doLogin, loading, error, user };
}