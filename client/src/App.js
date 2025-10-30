import React from "react";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserBlogs from "./pages/UserBlogs";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails"; // ✅ Full Blog Page
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* Common Header and Toaster */}
      <Header />
      <Toaster />

      {/* App Routes */}
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/blogs" element={<Blogs />} />

        {/* ✅ Route for viewing a single full blog */}
        <Route path="/blogs/:id" element={<BlogDetails />} />

        <Route path="/my-blogs" element={<UserBlogs />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
