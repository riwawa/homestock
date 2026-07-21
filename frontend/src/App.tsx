// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import { CurrentHouseProvider } from "./modules/house/context/CurrentHouseContext";
import { AppRoutes } from "./routes/AppRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrentHouseProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CurrentHouseProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;