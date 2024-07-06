import http from '@/lib/http';
import {
  AccountResType,
  ChangePasswordBodyType,
} from '@/schemaValidations/account.schema';
import { LoginBodyType, LoginResType, RefreshTokenBodyType, RefreshTokenResType } from '@/schemaValidations/auth.schema';
import { MessageResType } from '@/schemaValidations/common.schema';
import {
  GuestLoginBodyType,
  GuestLoginResType,
} from '@/schemaValidations/guest.schema';

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number,
    payload: RefreshTokenResType
  }> | null,
  SGuestLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>('/guest/auth/login', body),
  guestLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>('/api/guest/auth/login', body, {
      baseUrl: '',
    }),
  SLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, { baseUrl: '' }),
  logoutFromNextServerToServer: ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) =>
    http.post<MessageResType>(
      '/auth/logout',
      {
        refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
  logout: (
    body: {
      refreshToken: string;
    },
    signal?: AbortSignal | undefined
  ) =>
    http.post<MessageResType>('/api/auth/logout', body, {
      baseUrl: '',
      signal,
    }),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>('/account/change-password', body),
  sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/auth/refresh-token', body),
  async refreshToken(){
    // Prevent calling more than one times in a row
    if(this.refreshTokenRequest) return this.refreshTokenRequest;
    this.refreshTokenRequest = http.post<RefreshTokenResType>('/api/auth/refresh-token', null, { baseUrl: '' });
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  }
};

export default authApiRequest;
