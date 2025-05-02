import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import ScrollToTop from "./components/scroll-to-top";
import BeerCartPage from "./pages/beer-cart-page";
import BeerDetailPage from "./pages/beer-details-page";
import BeerListPage from "./pages/beer-list-page";

// Layout component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow w-full p-4 mx-auto max-w-7xl">{children}</main>
      <footer className="py-6 border-t bg-muted/50">
        <div className="mx-auto">
          <p className="text-center text-sm text-muted-foreground">
            🍺 Beer Lover App &copy; 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<BeerListPage />} />
          <Route path="/beer/:id" element={<BeerDetailPage />} />
          <Route path="/cart" element={<BeerCartPage />} />
        </Routes>
      </AppLayout>
      <Toaster />
    </Router>
  );
};

export default App;
