import { lazy, Suspense, memo} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScriptScenesList from "../components/ScriptScenesList";
import ScriptWriting from "../pages/editor/ScriptWriting";





// Lazy-loaded components

// const HomePage = lazy(() => import("../components/home/Home"));
const ProjectPage = lazy(() => import("../components/project/Projects"))
const SignupPage = lazy(() => import("../pages/auth/SignupPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const ProfileCreation = lazy(() => import("../pages/auth/ProfileCreation"));



const AppRoutes = memo(() => {
  return (
    <Router>
      <Suspense >
        <Routes>
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/create/profile" element={<ProfileCreation/>} />
          {/* User Routes */}
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<ProjectPage />} />
          <Route path="/scriptlists/:id" element={<ScriptScenesList />} />
        <Route path="/scriptwriter" element={<ScriptWriting />} />
        </Routes>
      </Suspense>
    </Router>
  );
});

export default AppRoutes;
