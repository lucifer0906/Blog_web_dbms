import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BlogCard from "../components/BlogCard"; // Updated BlogCard supports media & mediaType

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch all blogs
    const getAllBlogs = async () => {
        try {
            const { data } = await axios.get("/api/v1/blog/all-blog");
            if (data?.success) {
                setBlogs(data?.blogs);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    useEffect(() => {
        getAllBlogs();
    }, []);

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Hero Section */}
            <div style={{ background: "linear-gradient(to bottom, #f5f5f0, #e9f4eb)", padding: "80px 20px", textAlign: "center" }}>
                <h1 style={{ fontSize: "3.5rem", fontWeight: 700, marginBottom: "10px", color: "#333" }}>
                    Discover Stories That <span style={{ color: "#4CAF50" }}>Inspire</span>
                </h1>
                <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "40px" }}>
                    Explore insights, ideas, and inspiration from our community of passionate writers
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", maxWidth: "600px", margin: "0 auto" }}>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: "15px 20px", width: "100%", borderRadius: "8px 0 0 8px", border: "1px solid #ddd", outline: "none", fontSize: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
                    />
                    <button style={{ padding: "15px 30px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "0 8px 8px 0", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }}>
                        Search
                    </button>
                </div>
            </div>

            {/* Blogs Grid */}
            <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "40px auto", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <div>
                        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#333", margin: 0 }}>Featured Articles</h2>
                        <p style={{ color: "#666", marginTop: "5px", fontSize: "1rem" }}>Hand-picked stories worth your time</p>
                    </div>
                    <Link to="/blogs" style={{ textDecoration: "none", color: "#333", fontWeight: "bold", display: "flex", alignItems: "center" }} aria-label="View all blogs">
                        View all <span style={{ marginLeft: "5px" }}>→</span>
                    </Link>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", paddingTop: "20px" }}>
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog) => (
                            <BlogCard
                                key={blog._id}
                                id={blog._id}
                                isUser={localStorage.getItem("userId") === blog?.user?._id}
                                title={blog.title}
                                description={blog.description}
                                media={blog.media || blog.image}
                                mediaType={blog.mediaType || "image"}
                                coverImage={blog.coverImage}
                                username={blog?.user?.username}
                                time={blog.createdAt}
                            />
                        ))
                    ) : (
                        <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#666", fontSize: "1.1rem" }}>
                            No blogs found matching "{searchTerm}".
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blogs;
