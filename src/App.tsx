import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AutoBrief from "./pages/toolkit/AutoBrief";
import Objections from "./pages/toolkit/Objections";
import ICPScorer from "./pages/toolkit/ICPScorer";
import Battlecard from "./pages/toolkit/Battlecard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/projects" element={<Layout><Projects /></Layout>} />
      <Route path="/skills" element={<Layout><Skills /></Layout>} />
      <Route path="/projects/:id" element={<Layout><ProjectDetail /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/brief" element={<Layout><AutoBrief /></Layout>} />
      <Route path="/objections" element={<Layout><Objections /></Layout>} />
      <Route path="/icp" element={<Layout><ICPScorer /></Layout>} />
      <Route path="/battlecard" element={<Layout><Battlecard /></Layout>} />
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}

export default App;
