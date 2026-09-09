import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { AuthLayout } from "./layouts/AuthLayout";
import { AppLayout } from "./layouts/AppLayout";
import { AuthPage } from "./pages/AuthPage";
import { ProductsPage } from "./pages/app/ProductsPage";
import { StorePage } from "./pages/app/StorePage";
import { ProductItemsPage } from "./pages/app/ProductItemsPage";
import { ProfilePage } from "./pages/app/ProfilePage";
import { NotificationsPage } from "./pages/app/NotificationsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider maxSnack={3} autoHideDuration={4000}>
          <BrowserRouter>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/auth" element={<AuthPage />} />
              </Route>
              <Route element={<AppLayout />}>
                <Route
                  path="/app"
                  element={<Navigate to="/app/products" replace />}
                />
                <Route path="/app/store" element={<StorePage />} />
                <Route path="/app/products" element={<ProductsPage />} />
                <Route path="/app/product-items/:productId" element={<ProductItemsPage />} />
                <Route path="/app/profile" element={<ProfilePage />} />
                <Route path="/app/notifications" element={<NotificationsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
