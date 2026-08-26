import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { NewsProvider } from "./context/NewsContext";

const Home = lazy(() => import("./pages/Home"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const LiveTV = lazy(() => import("./pages/LiveTV"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NewsProvider>
          <Suspense fallback={
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#141414] text-white gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#AA0000] flex items-center justify-center font-black text-3xl tracking-tighter shadow-2xl animate-pulse">
                RGNN
              </div>
              <p className="text-xs uppercase tracking-widest font-mono text-neutral-400">
                Rajbanshi Global News Network
              </p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="article/:id" element={<ArticleDetail />} />
                <Route path="category/:category" element={<CategoryPage />} />
                <Route path="live" element={<LiveTV />} />
                <Route path="bookmarks" element={<Bookmarks />} />
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </Suspense>
        </NewsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
