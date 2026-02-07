"use client"

import { Icon } from "@iconify/react"

const features = [
  {
    icon: "mdi:language-python",
    title: "Python",
    description:
      "Belajar python untuk testing bug, algoritma, hacking, membuat AI, automatic generator, dan lain lain",
  },
  {
    icon: "mdi:hammer-wrench",
    title: "Praktik & Proyek",
    description:
      "Banyak praktik dan projek yang sudah saya kembangkan. bisa kalian lihat di github.com/K4K4NG dan github.com/MeledakCik.",
  },
  {
    icon: "mdi:web",
    title: "Web",
    description:
      "Kemampuan dalam membangun web site simpel dan kompleks menggunakan html, css, js",
  },
  {
    icon: "mdi:shield-lock",
    title: "Cyber Security",
    description:
      "Membangun aplikasi keamanan server, data, dan website. Termasuk penetration testing (ethical hacking).",
  },
  {
    icon: "mdi:code-tags",
    title: "Code Pemograman",
    description:
      "Bahasa yang dikuasai: Python, Ruby, Golang, C++, C#, Rust, PHP, JavaScript, Java, Kotlin, Dart, XML, dll",
  },
  {
    icon: "mdi:hiking",
    title: "Hobi",
    description:
      "Membuat berbagai aplikasi (web, desktop, GUI) serta hobi touring dan mendaki gunung",
  },
]

export default function TentangInformatika3() {
  return (
    <section
      id="tentang"
      className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-300/10 to-pink-200/10 blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800">
            Tentang{" "}
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Saya
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Saya berfokus pada pembelajaran, pengembangan, dan pembuatan script dalam hal cyber security, testing bug, dan web site.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-300"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-700 p-4 rounded-xl shadow-md">
                <Icon
                  icon={feature.icon}
                  className="text-white"
                  width="32"
                  height="32"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
