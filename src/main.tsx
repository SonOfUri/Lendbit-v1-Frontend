import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Background from "./components/shared/background.tsx";
import Navbar from "./components/shared/Navbar.tsx";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<QueryClientProvider client={queryClient}>
    <Router>
      <section className={`w-full relative overflow-hidden`}>
        <Background />
        <main className="w-full h-screen overflow-y-auto absolute left-0 top-0 z-10">
          <div className="max-w-[1542px] mx-auto mt-3">
            <Navbar />
            <App />
          </div>
          <Toaster richColors closeButton swipeDirections={["right", "left", "bottom", "top"]} position="top-center" />
        </main>
        </section>
		</Router>
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
	// </StrictMode>,
);
