import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

const UserBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    const getUserBlogs = async () => {
        try {
            const id = localStorage.getItem("userId");
            const { data } = await axios.get(`/api/v1/blog/user-blog/${id}`);
            if (data?.success) {
                setBlogs(data?.userBlog.blogs);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserBlogs();
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #eef2f3, #d4d8dd)",
                padding: "40px 20px",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "2.2rem",
                    fontWeight: "bold",
                    marginBottom: "30px",
                    color: "#333",
                }}
            >
                Your Blogs
            </h1>

            {blogs && blogs.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "30px",
                        maxWidth: "1200px",
                        margin: "0 auto",
                    }}
                >
                    {blogs.map((blog) => (
                        <BlogCard
                            key={blog._id}
                            id={blog._id}
                            isUser={true}
                            title={blog.title}
                            description={blog.description}
                            media={blog.media || blog.image}       // ✅ unified media
                            mediaType={blog.mediaType || "image"}  // ✅ fallback mediaType
                            username={blog.user.username}
                            time={blog.createdAt}
                        />
                    ))}
                </div>
            ) : (
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "100px",
                        color: "#555",
                        fontSize: "1.4rem",
                    }}
                >
                    <p>You haven't created any blogs yet.</p>
                </div>
            )}
        </div>
    );
};

export default UserBlogs;
