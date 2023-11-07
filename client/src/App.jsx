import { Route,Routes } from "react-router-dom";

import RequireAuth from "./components/auth/RequireAuth.jsx";
import NotFound from "./components/NotFound.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";


function App() {
  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route element={<RequireAuth/>}>
        <Route path="/" element={<Home />} />
        <Route path="/:username" element={<Profile/>}/>
      </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
}

export default App