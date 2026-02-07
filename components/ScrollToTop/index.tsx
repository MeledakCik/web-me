'use client'
import Link from 'next/link'

export default function ScrollToTop() {
  return (
    <div className='fixed bottom-8 right-8 z-999'>
      <div className='flex items-center gap-2.5'>
        <Link
          href={'/'}
          target='_blank'
          className='bg-blue-500 text-white hover:bg-transparent border border-gray-400 hover:border-gray-200 hover:text-primary text-sm font-medium px-4 py-3.5 leading-none rounded-lg text-nowrap'>
          Download Now
        </Link>
      </div>
    </div>
  )
}
