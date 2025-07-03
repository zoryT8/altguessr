import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import PlayPage from "./pages/PlayPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300"
      data-theme="dark"
    >
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/play/*" element={<PlayPage />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
