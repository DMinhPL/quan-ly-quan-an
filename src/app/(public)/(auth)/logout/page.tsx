'use client';
import { useAppContext } from '@/components/app-provider';
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

const LogoutPage = () => {
    const { mutateAsync: logoutMutate } = useLogoutMutation();
    const router = useRouter();
    const searchParam = useSearchParams();
    const refreshTokenFromUrl = searchParam.get('refreshToken');
    const accessTokenFromUrl = searchParam.get('accessToken');
    const { setIsAuth } = useAppContext();
    const ref = useRef<any>(null); //Once call mutateAsync, the ref will be set to null
    useEffect(() => {
        if (!ref.current
            && ((refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage())
                || accessTokenFromUrl && accessTokenFromUrl === getAccessTokenFromLocalStorage())) {
            ref.current = logoutMutate;
            logoutMutate({ refreshToken: localStorage.getItem('refreshToken') as string, }).then((res) => {
                setTimeout(() => {
                    ref.current = null
                }, 1000);
                setIsAuth(false);
                router.push('/login');
            })
        } else {
            router.push('/login');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logoutMutate, router, refreshTokenFromUrl, accessTokenFromUrl]);

    return (
        <div>
            Log out...
        </div>
    );
};

export default LogoutPage;