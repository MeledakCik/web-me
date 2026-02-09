import { FileArchive, Home, Inbox, LayoutDashboard,MailCheck, ChartAreaIcon } from "lucide-react";
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Exploit", url: "/exploit", icon: Inbox },
    { title: "Mail Generator", url: "/mail", icon: MailCheck },
    { title: "File File", url: "/file", icon: FileArchive },
    { title: "Halaman Cover", url: "/me", icon: Home },
];

export function AppSidebar({ onItemClick }: { onItemClick?: () => void }) {
    return (
        <div className="flex flex-col bg-gray-900 border-r border-gray-800 shadow-lg h-full">
            <SidebarContent className="bg-gray-900 text-gray-100">
                <div className="flex flex-col items-center gap-2 p-4 border-b border-gray-800">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold tracking-wide">Cikawan - Kasyaf</h2>
                        <p className="text-sm text-gray-400">Administrator</p>
                    </div>
                </div>
                <SidebarGroup>
                    <SidebarGroupContent className="gap-2 px-3 pt-4">
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="hover:bg-gray-800/60 transition-colors rounded-lg px-3 py-2 flex items-center gap-3 group"
                                    >
                                        <a
                                            href={item.url}
                                            className="flex items-center gap-3 w-full"
                                            onClick={onItemClick}
                                        >
                                            <item.icon className="text-gray-400 group-hover:text-white transition-colors" />
                                            <span className="text-gray-200 group-hover:text-white transition-colors">
                                                {item.title}
                                            </span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </div>
    );
}
