import authApiRequest from '@/apiRequests/auth';
import { HttpError } from '@/lib/http';
import { LoginBodyType } from '@/schemaValidations/auth.schema';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if (!refreshToken) {
        return Response.json(
            {
                message: 'Không tìm thấy refreshToken'
            }, { status: 401 }
        )
    }
    try {
        const { payload } = await authApiRequest.sRefreshToken({ refreshToken });
        const decodedAccessToken = jwt.decode(payload.data.accessToken) as { exp: number };
        const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number };
        cookieStore.set('accessToken', payload.data.accessToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            expires: new Date(decodedAccessToken.exp * 1000),
        });
        cookieStore.set('refreshToken', payload.data.refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            expires: new Date(decodedRefreshToken.exp * 1000),
        });
        return Response.json(payload);
    } catch (error: any) {
        return Response.json(
            {
                message: error.message ?? 'Lỗi không xác định',
            },
            {
                status: 401,
            }
        );
    }
}
