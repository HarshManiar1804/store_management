import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
// Import all page components
import Store from "./pages/Store";
import SKUs from "./pages/SKUs";
import Planning from "./pages/Planning";
import Charts from "./pages/Charts";

// Layout component to maintain consistent structure
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Store />} />
          <Route path="/store" element={<Store />} />
          <Route path="/skus" element={<SKUs />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/charts" element={<Charts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
