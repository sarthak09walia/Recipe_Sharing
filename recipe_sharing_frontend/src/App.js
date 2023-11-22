import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/layout";
import Home from "./components/Home/home.js";
import NoPage from "./components/Pages/nopage";
import Login from "./components/Login/login";
import Register from "./components/Login/register";
import ActivationPage from "./components/Login/activation";
import AddRecipe from "./components/Home/addrecipe";
import UserProfile from "./components/Pages/userdetails";
import EditRecipe from "./components/Home/editrecipe";
import SharedRecipe from "./components/Pages/sharedrecipe";
import "./App.css";
import PasswordReset from "./components/Login/password_reset";
import ForgotPassword from "./components/Login/forgotpassword";
import Profile from "./components/Pages/profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="addrecipe" element={<AddRecipe />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="recipe/:recipe_id" element={<SharedRecipe />} />
          <Route
            path="profile/editrecipe/:recipe_id"
            element={<EditRecipe />}
          />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="activate/:uid/:token" element={<ActivationPage />} />
          <Route
            path="password-reset/:uid/:token"
            element={<PasswordReset />}
          />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
