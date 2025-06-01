
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
  Apple, 
  Heart, 
  Clock, 
  Flame, 
  Trophy, 
  Calendar, 
  Star, 
  Camera,
  Menu
} from "lucide-react";

const menuItems = [
  { title: "Treinos", url: "/treinos", icon: Activity, color: "text-orange-500" },
  { title: "Alimentação", url: "/alimentacao", icon: Apple, color: "text-green-500" },
  { title: "Suplementos", url: "/suplementos", icon: Heart, color: "text-purple-500" },
  { title: "Divisão do Dia", url: "/divisao", icon: Clock, color: "text-blue-500" },
  { title: "Regras Mentais", url: "/regras", icon: Flame, color: "text-red-500" },
  { title: "Metas", url: "/metas", icon: Trophy, color: "text-yellow-500" },
  { title: "Check-in Diário", url: "/checkin", icon: Calendar, color: "text-indigo-500" },
  { title: "Progresso Total", url: "/progresso", icon: Star, color: "text-pink-500" },
  { title: "Fotos", url: "/fotos", icon: Camera, color: "text-cyan-500" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <SidebarTrigger className="bg-fitness-red hover:bg-fitness-red-dark text-white p-2 rounded-lg shadow-lg">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
      </div>

      <Sidebar className="border-r border-fitness-gray-dark">
        <div className="p-4 md:p-6 border-b border-fitness-gray-dark">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/84acf049-3854-4906-b2db-530e1d921fce.png" 
              alt="Shape Insano Logo" 
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <div>
              <h1 className="text-lg md:text-2xl font-bold gradient-red bg-clip-text text-transparent">
                Shape Insano
              </h1>
              <p className="text-fitness-gray-light text-xs md:text-sm mt-1">28 Dias de Transformação</p>
            </div>
          </div>
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
                          m-1 rounded-lg
                        `}
                      >
                        <button 
                          onClick={() => navigate(item.url)}
                          className="flex items-center gap-3 w-full p-2 md:p-3 rounded-lg"
                        >
                          <item.icon 
                            className={`h-4 w-4 md:h-5 md:w-5 transition-all duration-300 
                              ${isActive ? 'text-white scale-110' : `${item.color} group-hover:text-fitness-red`}
                            `} 
                          />
                          <span className={`font-medium transition-all duration-300 text-sm md:text-base
                            ${isActive ? 'text-white' : 'group-hover:text-white'}
                          `}>
                            {item.title}
                          </span>
                          {isActive && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 md:h-8 bg-white rounded-l-full" />
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
        
        <div className="p-4 md:p-6 border-t border-fitness-gray-dark">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-fitness-red animate-pulse">🔥</div>
            <p className="text-xs text-fitness-gray-light mt-1">Foco Total</p>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
