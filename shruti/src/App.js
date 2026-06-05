import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import PublicLayout from "./components/PublicLayout";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MyPortfolio from "./pages/MyPortfolio";
import GitHubImport from "./pages/GitHubImport";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Templates from "./pages/Templates";
import ResumeBuilder from "./pages/ResumeBuilder";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import Editor from "./pages/Editor";
import ProjectList from "./pages/ProjectList";
import ResumeList from "./pages/ResumeList";
import Preview from "./pages/Preview";
import NotFound from "./pages/NotFound";
import "./styles/design-system.css";
import "./styles/style.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/preview" element={<Preview />} />
            </Route>

            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-portfolio" element={<MyPortfolio />} />
              <Route path="/github-import" element={<GitHubImport />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/my-projects" element={<ProjectList />} />
              <Route path="/my-resumes" element={<ResumeList />} />
              <Route path="/builder/:id" element={<ResumeBuilder />} />
              <Route path="/portfolio-builder/:id" element={<PortfolioBuilder />} />
              <Route path="/editor/:type/:id" element={<Editor />} />
            </Route>

            <Route element={<PublicLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
