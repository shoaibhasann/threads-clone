import { Route,Routes } from "react-router-dom";

import RequireAuth from "./components/auth/RequireAuth.jsx";
import NotFound from "./components/NotFound.jsx";
import ThreadForm from "./components/thread/ThreadForm.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Signup from "./pages/Signup.jsx";


function App() {

  return (
    <Routes>
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/new-thread" element={<ThreadForm />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App