import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { BrowsePage } from "./pages/BrowsePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { SkillDetailPage } from "./pages/SkillDetailPage";
import { SubmitPage } from "./pages/SubmitPage";
import { DocsPage } from "./pages/DocsPage";
import { SecurityPage } from "./pages/SecurityPage";
import { AboutPage } from "./pages/AboutPage";
import { BrandPage } from "./pages/BrandPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
