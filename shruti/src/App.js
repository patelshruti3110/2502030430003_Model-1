import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreatePortfolio from "./pages/CreatePortfolio";
import AddProject from "./pages/AddProject";
import Preview from "./pages/Preview";
function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/create" element={<CreatePortfolio />} />
<Route path="/project" element={<AddProject />} />
<Route path="/preview" element={<Preview />} />
</Routes>
</BrowserRouter>
);
}
export default App;