'use client';
import { getRefreshTokenFromLocalStorage } from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

const LogoutPage = () => {
    const { mutateAsync: logoutMutate } = useLogoutMutation();
    const router = useRouter();
    const searchParam = useSearchParams();
    const refreshTokenFromUrl = searchParam.get('refreshToken');
    const accessTokenFromUrl = searchParam.get('accessToken');
    const ref = useRef<any>(null); //Once call mutateAsync, the ref will be set to null
    useEffect(() => {
        if (ref.current
            || (refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshTokenFromLocalStorage())
            || accessTokenFromUrl && accessTokenFromUrl !== localStorage.getItem('accessToken')) return;
        ref.current = logoutMutate;
        logoutMutate({ refreshToken: localStorage.getItem('refreshToken') as string, }).then((res) => {
            setTimeout(() => {
                ref.current = null
            }, 1000);
            router.push('/login')
        })
    }, [logoutMutate, router, refreshTokenFromUrl, accessTokenFromUrl])

    return (
        <div>
            Page
        </div>
    );
};

export default LogoutPage;