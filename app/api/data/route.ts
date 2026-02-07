import { NextResponse } from 'next/server'

import { NavLinkType } from '@/app/types/navlink'

const NavLinkData: NavLinkType[] = [
  {
    label: 'Dashboard',
    href: '/#dashboard',
  },
  {
    label: 'About Me',
    href: '/#tentang',
  },
  {
    label: 'Talent Interest',
    href: '/#learning-path',
  },
]
export const GET = () => {
  return NextResponse.json({
    NavLinkData,
  })
}
