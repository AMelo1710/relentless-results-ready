
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Treinos from "./pages/Treinos";
import Alimentacao from "./pages/Alimentacao";
import Suplementos from "./pages/Suplementos";
import Divisao from "./pages/Divisao";
import Regras from "./pages/Regras";
import Metas from "./pages/Metas";
import CheckIn from "./pages/CheckIn";
import Progresso from "./pages/Progresso";
import Fotos from "./pages/Fotos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/treinos" replace />} />
            <Route path="/treinos" element={<Treinos />} />
            <Route path="/alimentacao" element={<Alimentacao />} />
            <Route path="/suplementos" element={<Suplementos />} />
            <Route path="/divisao" element={<Divisao />} />
            <Route path="/regras" element={<Regras />} />
            <Route path="/metas" element={<Metas />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/progresso" element={<Progresso />} />
            <Route path="/fotos" element={<Fotos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
