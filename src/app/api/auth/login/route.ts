import autApiRequest from '@/apiRequests/auth';
import { LoginBodyType } from '@/schemaValidations/auth.schema';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { HttpError } from '@/lib/http';

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = cookies();

  try {
    const { payload } = await autApiRequest.sLogin(body);
    const {
      data: { accessToken, refreshToken },
    } = payload;
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: decodedAccessToken.exp - Date.now(),
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: decodedRefreshToken.exp - Date.now(),
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json({ error: 'Something went wrong' }, { status: 500 });
    }
  }
}
