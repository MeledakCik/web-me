'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'

const FooterIF3 = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0A1E3F] via-[#1B2A52] to-[#2E5D9F] text-gray-200 border-t border-gray-700 mt-20">
      <div className="container mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-semibold text-blue-300 mb-4">
            CIKKAWAN
          </h2>
          <p className="text-sm leading-6 text-gray-300">
            Portal resmi web <span className="font-semibold text-white">CIKKAWAN</span>.
            Akses pembelajaran dan profile saya dengan mudah di satu tempat.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Menu</h3>
          <ul className="space-y-2">
            <li><Link href="/#dashboard" className="hover:text-blue-300 transition">Dashboard</Link></li>
            <li><Link href="/#tentang" className="hover:text-blue-300 transition">About Me</Link></li>
            <li><Link href="/#learning-path" className="hover:text-blue-300 transition">Pembelajaran</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Sosial Media</h3>
          <div className="flex gap-4">
            <Link href="https://instagram.com/kkngksyf__" target="_blank">
              <Icon icon="tabler:brand-instagram" width={26} height={26} className="hover:text-blue-300 transition" />
            </Link>
            <Link href="https://github.com/K4K4NG" target="_blank">
              <Icon icon="tabler:brand-github" width={26} height={26} className="hover:text-blue-300 transition" />
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Kontak Developer</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon icon="tabler:phone" width={20} height={20} />
              <Link href="tel:+6281322544391" className="hover:text-blue-300 transition">
                +62 813 2254 4391
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="tabler:mail" width={20} height={20} />
              <Link href="mailto:kakangdanadam@gmail.com" className="hover:text-blue-300 transition">
                kakangdanadam@gmail.com
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 py-4 text-center text-sm text-gray-300">
        © 2025 Kelas IF3 — Dibuat dengan ❤️ oleh{' '}
        <span className="text-blue-300 font-semibold">Cikawan</span>
      </div>
    </footer>
  )
}

export default FooterIF3
