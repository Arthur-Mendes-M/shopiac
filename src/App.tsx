// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import MyAccount from "./pages/MyAccount";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/scrollToTop";
import { RequireAuth } from "./contexts/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="sportshop-theme">
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            {/* <Toaster /> */}
            <Sonner
              closeButton
              position="bottom-right"
              swipeDirections={["bottom", "left", "right", "top"]}
              visibleToasts={2}
              style={{ fontSize: 30 }}
              className="text-2xl"
              invert
            />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/uniformes" element={<Products />} />
                <Route path="/canecas" element={<Products />} />
                <Route path="/acessorios" element={<Products />} />
                <Route path="/promocoes" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/checkout"
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <RequireAuth>
                      <MyAccount />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <RequireAuth>
                      <MyOrders />
                    </RequireAuth>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
