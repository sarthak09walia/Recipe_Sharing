import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./components/home.js";
import NoPage from "./components/nopage";
import Login from "./components/login";
import Register from "./components/register";
import ActivationPage from "./components/activation";
import AddRecipe from "./components/addrecipe";
import UserProfile from "./components/userdetails";
import EditRecipe from "./components/editrecipe";
import SharedRecipe from "./components/sharedrecipe";
import "./App.css";
import PasswordReset from "./components/password_reset";
import ForgotPassword from "./components/forgotpassword";
import Profile from "./components/profile";

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
