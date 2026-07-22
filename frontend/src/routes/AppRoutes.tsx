import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { AuthGuard } from "../modules/auth/components/AuthGuard";
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { RegisterPage } from "../modules/auth/pages/RegisterPage";
import { HousesPage } from "../modules/house/pages/HousesPage";
import { HouseDetailPage } from "../modules/house/pages/HouseDetailPage";
import { HouseCreatePage } from "../modules/house/pages/HouseCreatePage";
import { ProductsPage } from "../modules/product/pages/ProductsPage";
import { ProductDetailPage } from "../modules/product/pages/ProductDetailPage";
import { ProductCreatePage } from "../modules/product/pages/ProductCreatePage";
import { ProductEditPage } from "../modules/product/pages/ProductEditPage";
import { InventoryPage } from "../modules/inventory/pages/InventoryPage";
import { ShoppingListPage } from "../modules/shoppinglist/pages/ShoppingListPage";
import { PurchasePage } from "../modules/purchase/pages/PurchasePage";
import { SettingsPage } from "../pages/SettingsPage";
import { TrendsPage } from "../modules/purchase/pages/TrendsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AuthGuard />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/houses" replace />} />

          <Route path="/houses" element={<HousesPage />} />
          <Route path="/houses/new" element={<HouseCreatePage />} />
          <Route path="/houses/:id" element={<HouseDetailPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductCreatePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<ProductEditPage />} />

          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
          <Route path="/purchase" element={<PurchasePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/trends" element={<TrendsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}