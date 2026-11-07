import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "./components/Layout";
import { LoadingState } from "./components/LoadingState";

const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const BrowsePage = lazy(() => import("./pages/BrowsePage").then((m) => ({ default: m.BrowsePage })));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage })));
const CollectionsPage = lazy(() => import("./pages/CollectionsPage").then((m) => ({ default: m.CollectionsPage })));
const SkillDetailPage = lazy(() => import("./pages/SkillDetailPage").then((m) => ({ default: m.SkillDetailPage })));
const SubmitPage = lazy(() => import("./pages/SubmitPage").then((m) => ({ default: m.SubmitPage })));
const DocsPage = lazy(() => import("./pages/DocsPage").then((m) => ({ default: m.DocsPage })));
const SecurityPage = lazy(() => import("./pages/SecurityPage").then((m) => ({ default: m.SecurityPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const BrandPage = lazy(() => import("./pages/BrandPage").then((m) => ({ default: m.BrandPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

import { Container } from "./components/Container";
import { AuthProvider } from "./lib/auth";

function RouteFallback() {
  return (
    <div className="page" style={{ minHeight: "400px", padding: "40px 0" }}>
      <Container>
        <LoadingState />
      </Container>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/skills/:slug" element={<SkillDetailPage />} />
                <Route path="/submit" element={<SubmitPage />} />
                <Route path="/docs/*" element={<DocsPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/brand" element={<BrandPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
