import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/signUpPage";
import NavBar from "./components/NavBar";
import "./css/App.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUserFromToken } from "./store/userSlice";
import Cookies from 'js-cookie';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if(token) {
      dispatch(setUserFromToken(token));
    }
  }, [dispatch]);

  return (
    <Router>
      <NavBar />
      <div style={{paddingTop: '80px'}}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
