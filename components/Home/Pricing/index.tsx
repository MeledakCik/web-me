'use client'

import { Icon } from '@iconify/react'
import { useState } from 'react'
import PricingSkeleton from '@/components/Skeleton/Pricing'

type PathType = {
  name: string
  level: string
  desc: string
  tools: string[]
  icon: string
}

const CodingPath = () => {
  const PathData: PathType[] = [
    {
      name: 'Frontend',
      level: 'Dasar → Lanjut',
      desc: 'Bangun tampilan web interaktif dan responsif seperti dashboard kelas IF3 menggunakan HTML, CSS, JavaScript, dan React/Next.js.',
      tools: ['HTML, CSS, JS', 'React.js & Next.js', 'Tailwind CSS', 'UI/UX Design'],
      icon: 'mdi:monitor-dashboard',
    },
    {
      name: 'Backend',
      level: 'Menengah → Mahir',
      desc: 'Pelajari cara membuat sistem login, API, dan database untuk portal kelas menggunakan Node.js, Express, dan MySQL.',
      tools: ['Node.js & Express', 'REST API', 'MySQL & MongoDB', 'Authentication & Middleware'],
      icon: 'mdi:server',
    },
    {
      name: 'Cyber Security',
      level: 'Dasar → Mahir',
      desc: 'Eksplorasi keamanan informasi dan pengetahuan penting tentang keamanan jaringan, aplikasi, dan data',
      tools: ['PYTHON', 'GOLANG', 'RUST', 'JS'], 
      icon: 'mdi:brain',
    },
  ]

  const [loading] = useState(false)

  return (
    <section
      id="learning-path"
      className="scroll-mt-12 py-16 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 dark:text-blue-100">
            Membuka Jalur Pembelajaran
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto mt-4 text-gray-700 dark:text-gray-300">
            Pembelajaran dibuka oleh pemilik web ini yang terdiri dari 3 jalur.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <PricingSkeleton key={i} />)
            : PathData.map((item, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl border border-blue-200 dark:border-blue-800 transition-all duration-300 flex flex-col p-8"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
                    <Icon icon={item.icon} width={32} height={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 dark:text-white">{item.name}</h3>
                </div>

                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {item.level}
                </p>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {item.desc}
                </p>

                {/* Tools */}
                <ul className="flex flex-col gap-3 my-4">
                  {item.tools.map((tool, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        <Icon icon="material-symbols:check-rounded" width={18} height={18} />
                      </div>
                      <p className="text-base text-gray-800 dark:text-gray-200">{tool}</p>
                    </li>
                  ))}
                </ul>

                {/* Tombol */}
                <button className="mt-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 shadow-md">
                  Mulai Jalur Ini 🚀
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default CodingPath
