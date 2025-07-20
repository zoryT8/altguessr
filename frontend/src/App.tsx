import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import PlayPage from "./pages/PlayPage";
import NotFoundPage from "./pages/NotFoundPage";
import MapsPage from "./pages/MapsPage";
import MapEditPage from "./pages/MapEditPage";
import LoginPage from "./pages/LoginPage";

export const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

function App() {
  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300"
      data-theme="dark"
    >
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        {/* <Route path="/register" element={<RegisterPage />}></Route> */}
        <Route path="/play/*" element={<PlayPage numRounds={5} />}></Route>
        <Route path="/maps" element={<MapsPage />}></Route>
        <Route path="/maps/edit/:id" element={<MapEditPage />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
