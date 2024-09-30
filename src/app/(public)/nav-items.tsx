'use client';

import { getAccessTokenFromLocalStorage } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu',
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true,
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false,
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true,
  },
];
// !!!  React Hydration error Notes: https://nextjs.org/docs/messages/react-hydration-error  !!!
// * Server: Initially renders the "Mon an" and "Dang nhap" menu because it doesn't know if the user is logged in.
// * Client: Initially, it also renders "Mon an" and "Dang nhap". 
//           Afterward, once it checks the user's login status (via localStorage), 
//           it updates to display the full authenticated menu if the user is logged in.

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false);

  /**
   * How to fix: React Hydration error
   * Using useEffect
   */
  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
  }, [isAuth]);

  return menuItems.map((item) => {
    if (
      (item.authRequired === true && !isAuth) ||
      (item.authRequired === false && isAuth)
    ) {
      return null;
    }
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
