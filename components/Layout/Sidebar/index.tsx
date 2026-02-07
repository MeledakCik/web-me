'use client'

import { UserCheck2, Home, Image, BookAIcon, GraduationCap, Library , TestTubes} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const items = [
    { title: "Dashboard", url: "#", icon: Home },
    { title: "Aib Kelas", url: "/class/aib", icon: UserCheck2 },
    { title: "Gambar Kelas", url: "/class/kelas", icon: Image },
    { title: "Kurikulum", url: "/class/kurikulum", icon: TestTubes },
    { title: "Materi", url: "/class/materi", icon: Library },
    { title: "Tugas", url: "/class/tugas", icon: BookAIcon },
]

export function AppSidebar() {
    return (
        <Sidebar className="w-64 bg-blue-400 shadow-md">
            <SidebarContent>
                {/* Header */}
                <div className="flex items-center justify-center py-6 border-b border-blue-200">
                    <GraduationCap className="w-8 h-8 text-blue-600 mr-2" />
                    <h1 className="text-lg font-bold text-blue-700 tracking-wide">
                        Informatika<span className="text-blue-500">3</span>
                    </h1>
                </div>

                {/* Navigasi */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-blue-500 uppercase tracking-wider text-xs px-6 mt-4">
                        Menu
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="px-3 mt-2 space-y-1">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="w-full">
                                        <Link
                                            href={item.url}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Footer */}
                <div className="mt-auto border-t border-blue-100 py-4 px-4 text-xs text-gray-500">
                    <p>📘 IF-3 Dashboard</p>
                    <p>© 2025 Universitas Komputer</p>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}
