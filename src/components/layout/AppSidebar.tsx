import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Home,
  LogOut,
  Settings,
  Users,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "My Notes", url: "/notes", icon: FileText },
  { title: "Shared Notes", url: "/shared", icon: Users },
  { title: "Notifications", url: "/notifications", icon: Bell, badge: 3 }, // Sample unread count
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (active: boolean) =>
    active 
      ? "bg-primary text-primary-foreground shadow-md font-medium" 
      : "hover:bg-accent hover:text-accent-foreground transition-colors";

  return (
    <Sidebar
      className={`glass border-r border-border/50 transition-all duration-300 ${
        isCollapsed ? "w-14" : "w-60"
      }`}
      collapsible="icon"
    >
      <SidebarContent>
        {/* App Logo/Brand */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-semibold text-lg gradient-text">Notes</h1>
                <p className="text-xs text-muted-foreground">Premium</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavCls(isActive(item.url))} relative`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span>{item.title}</span>
                          {item.badge && item.badge > 0 && (
                            <Badge className="h-5 min-w-5 text-xs px-1.5 bg-accent text-accent-foreground">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                      {/* Badge for collapsed state */}
                      {isCollapsed && item.badge && item.badge > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom section */}
        <div className="p-4 border-t border-border/50">
          <SidebarMenuButton className="w-full text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Logout</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}