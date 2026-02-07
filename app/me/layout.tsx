'use client';
import { useEffect,useRef, useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/Layout/Footer'
import '../globals.css'
import ScrollToTop from '@/components/ScrollToTop'
import HeaderLink from './Navigation/HeaderLink'
import { NavLinkType } from '@/app/types/navlink'
import { Icon } from '@iconify/react'
import MobileHeaderLink from './Navigation/MobileHeaderLink'

export default function Layout({ children }: { children: React.ReactNode }) {
    const [sticky, setSticky] = useState(false)
    const [navlink, setNavlink] = useState<NavLinkType[]>([])
    const [navbarOpen, setNavbarOpen] = useState(false)
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await fetch('/api/data')
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setNavlink(data.NavLinkData)
          } catch (error) {
            console.error('Error fetching service', error)
          }
        }
        fetchData()
      }, [])
    
      const handleScroll = () => {
        setSticky(window.scrollY >= 80)
      }
    
      const handleClickOutside = (event: MouseEvent) => {
        if (
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(event.target as Node) &&
          navbarOpen
        ) {
          setNavbarOpen(false)
        }
      }
    
      useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
          window.removeEventListener('scroll', handleScroll)
          document.removeEventListener('mousedown', handleClickOutside)
        }
      }, [navbarOpen])
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <header
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${sticky
                    ? 'bg-white/90 backdrop-blur-md shadow-md text-gray-900'
                    : 'bg-white/90 backdrop-blur-md shadow-md text-gray-900'
                    }`}
            >
                <div
                    className={`container mx-auto flex items-center justify-between px-6 lg:px-12 ${sticky ? 'py-3' : 'py-4'
                        } transition-all duration-300`}
                >
                    <Link href="/" className="font-bold text-xl tracking-wide">
                        <span
                            className={`${sticky
                                ? 'text-blue-600'
                                : 'text-blue-600'
                                }`}
                        >
                            MUHAMMAD KASYAF
                        </span>{' '}
                        <span className="text-black">- CV</span>
                    </Link>
                    <nav>
                        <ul
                            className={`hidden xl:flex items-center gap-8 ${sticky ? 'text-gray-700' : 'text-white'
                                }`}
                        >
                            {navlink.map((item, index) => (
                                <HeaderLink key={index} item={item} />
                            ))}
                        </ul>
                    </nav>
                    <div className="flex items-center gap-4 xl:hidden">
                        <button
                            onClick={() => setNavbarOpen(!navbarOpen)}
                            className="flex flex-col justify-center gap-1"
                            aria-label="Toggle mobile menu"
                        >
                            <span className="block w-6 h-0.5 bg-gray-800"></span>
                            <span className="block w-6 h-0.5 mt-1.5 bg-gray-800"></span>
                            <span className="block w-6 h-0.5 mt-1.5 bg-gray-800"></span>
                        </button>
                    </div>
                </div>

                {navbarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 xl:hidden"
                        onClick={() => setNavbarOpen(false)}
                    />
                )}

                <div
                    ref={mobileMenuRef}
                    className={`fixed top-0 right-0 h-full w-full max-w-xs xl:hidden
                    transform transition-transform duration-300
                    ${navbarOpen ? 'translate-x-0' : 'translate-x-full'}
                    z-50 bg-gradient-to-b from-white to-blue-50`}
                >
                    <div className="flex items-center justify-between p-4">
                        <span className="text-lg font-semibold tracking-wide">
                            Menu Navigasi
                        </span>
                        <button
                            onClick={() => setNavbarOpen(false)}
                            aria-label="Close mobile menu"
                        >
                            <Icon
                                icon="solar:close-circle-linear"
                                width={26}
                                height={26}
                                className="text-blue-500 hover:text-blue-600 transition-colors"
                            />

                        </button>
                    </div>
                    <nav className="flex flex-col items-start p-4 gap-4 bg-white">
                        {navlink.map((item, index) => (
                            <MobileHeaderLink key={index} item={item} />
                        ))}
                        <Link
                            href="/#contact"
                            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 w-full text-center shadow-sm"
                            onClick={() => setNavbarOpen(false)}
                        >
                            Contact Us
                        </Link>

                    </nav>
                </div>
            </header>
            <main className="w-full pt-[72px] xl:pt-0">
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
}
