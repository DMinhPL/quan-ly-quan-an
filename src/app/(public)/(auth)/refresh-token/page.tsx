'use client';
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const RefreshTokenPage = () => {
    const router = useRouter();
    const searchParam = useSearchParams();
    const refreshTokenFromUrl = searchParam.get('refreshToken');
    const redirectPathname = searchParam.get('redirect');
    useEffect(() => {
        if ((refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage())) {
            checkAndRefreshToken({
                onSuccess() {
                    router.push(redirectPathname ?? '/');
                }
            })
        }
       
    }, [router, refreshTokenFromUrl, redirectPathname])

    return (
        <div>
            Page
        </div>
    );
};

export default RefreshTokenPage;