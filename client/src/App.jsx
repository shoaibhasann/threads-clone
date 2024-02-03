
import { Route,Routes } from "react-router-dom";

import RequireAuth from "./components/auth/RequireAuth.jsx";
import NotFound from "./components/NotFound.jsx";
import ThreadForm from "./components/thread/ThreadForm.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import EditThread from "./pages/EditThread.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ThreadDetail from "./pages/ThreadDetail.jsx";
import UserPage from "./pages/UserPage.jsx";




function App() {

  return (
    <Routes>
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Home />} />
        <Route path="/new-thread" element={<ThreadForm />} />
        <Route path="/edit-thread" element={<EditThread/>} />
        <Route path="/:username/thread/:id" element={<ThreadDetail />} />
        <Route path="/:username/user/:id" element={<UserPage />} />
        <Route path="/edit-profile/:username" element={<EditProfile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
