import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "sonner";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Carregamento Preguiçoso das novas rotas (placeholders por enquanto)
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Sonner position="top-center" richColors />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-[#090F15] flex items-center justify-center text-white/50">Carregando...</div>}>
          <Routes>
            {/* Público */}
            <Route path="/" element={<Index />} />
            <Route path="/agendamento" element={<BookingPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            
            {/* Admin (Proteção será adicionada na Fase 3) */}
            <Route path="/admin/*" element={<AdminLayout />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}