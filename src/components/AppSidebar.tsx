
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Activity, 
  Nutrition, 
  Heart, 
  Clock, 
  Flame, 
  Trophy, 
  Calendar, 
  Star, 
  Camera 
} from "lucide-react";

const menuItems = [
  { title: "Treinos", url: "/treinos", icon: Activity },
  { title: "Alimentação", url: "/alimentacao", icon: Nutrition },
  { title: "Suplementos", url: "/suplementos", icon: Heart },
  { title: "Divisão do Dia", url: "/divisao", icon: Clock },
  { title: "Regras Mentais", url: "/regras", icon: Flame },
  { title: "Metas", url: "/metas", icon: Trophy },
  { title: "Check-in Diário", url: "/checkin", icon: Calendar },
  { title: "Progresso Total", url: "/progresso", icon: Star },
  { title: "Fotos", url: "/fotos", icon: Camera },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r border-fitness-gray-dark">
      <div className="p-6 border-b border-fitness-gray-dark">
        <h1 className="text-2xl font-bold gradient-red bg-clip-text text-transparent">
          Shape Insano
        </h1>
        <p className="text-fitness-gray-light text-sm mt-1">28 Dias de Transformação</p>
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (location.pathname === '/' && item.url === '/treinos');
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={`
                        group relative transition-all duration-300 hover:bg-fitness-red/20 
                        ${isActive ? 'bg-fitness-red text-white' : 'text-fitness-gray-light'}
                      `}
                    >
                      <button 
                        onClick={() => navigate(item.url)}
                        className="flex items-center gap-3 w-full p-3 rounded-lg"
                      >
                        <item.icon 
                          className={`h-5 w-5 transition-all duration-300 
                            ${isActive ? 'text-white scale-110' : 'text-fitness-gray-light group-hover:text-fitness-red'}
                          `} 
                        />
                        <span className={`font-medium transition-all duration-300 
                          ${isActive ? 'text-white' : 'group-hover:text-white'}
                        `}>
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="p-6 border-t border-fitness-gray-dark">
        <div className="text-center">
          <div className="text-2xl font-bold text-fitness-red">🔥</div>
          <p className="text-xs text-fitness-gray-light mt-1">Foco Total</p>
        </div>
      </div>
    </Sidebar>
  );
}
