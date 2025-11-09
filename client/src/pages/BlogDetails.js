import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const BlogDetails = () => {
    const [blog, setBlog] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`/api/v1/blog/get-blog/${id}`);
                if (data?.success) {
                    setBlog(data.blog);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchBlog();
    }, [id]);

    if (!blog) return <p style={{ textAlign: "center" }}>Loading...</p>;

    const { title, description, media, mediaType, user, createdAt, coverImage } = blog;

    // 🎥 Detect YouTube
    let videoEmbedUrl = "";
    if (media?.includes("youtube.com") || media?.includes("youtu.be")) {
        let videoId = "";
        if (media.includes("v=")) videoId = media.split("v=")[1].split("&")[0];
        else if (media.includes("youtu.be/")) videoId = media.split("youtu.be/")[1].split("?")[0];
        videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "50px auto",
                backgroundColor: "#fff",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                fontFamily: "'Poppins', sans-serif",
            }}
        >
            {/* 🖼️ Media Section */}
            {/* Cover Image if available */}
            {coverImage && !videoEmbedUrl && (
                <img
                    src={coverImage}
                    alt={title}
                    style={{
                        width: "100%",
                        borderRadius: "12px",
                        marginBottom: "25px",
                        objectFit: "cover",
                        maxHeight: 480,
                    }}
                />
            )}

            {videoEmbedUrl ? (
                <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <iframe
                        width="100%"
                        height="400"
                        src={videoEmbedUrl}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: "12px" }}
                    ></iframe>
                </div>
            ) : media && /\.(mp4|webm|ogg)$/i.test(media) ? (
                <video
                    width="100%"
                    height="400"
                    controls
                    style={{ borderRadius: "12px", marginBottom: "25px" }}
                >
                    <source src={media} type={mediaType || "video/mp4"} />
                    Your browser does not support the video tag.
                </video>
            ) : (
                media && (
                    <img
                        src={media}
                        alt={title}
                        style={{
                            width: "100%",
                            borderRadius: "12px",
                            marginBottom: "25px",
                            objectFit: "cover",
                        }}
                    />
                )
            )}

            {/* 📝 Title */}
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    textAlign: "center",
                    marginBottom: "10px",
                    color: "#333",
                }}
            >
                {title}
            </h1>

            {/* 👤 Author Info */}
            <div style={{ textAlign: "center", marginBottom: "30px", color: "#960707ff" }}>
                <div
                    style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        backgroundColor: "#db0707ff",
                        margin: "0 auto 10px auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        color: "#0b0707ff",
                    }}
                >
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <p style={{ margin: 0, fontWeight: 600 }}>{user?.username}</p>
                <p style={{ fontSize: "0.9rem", color: "#888" }}>
                    {new Date(createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            {/* 📖 Description */}
            <div
                style={{
                    marginTop: "10px",
                    fontSize: "1.05rem",
                    lineHeight: 1.8,
                    color: "#333",
                    textAlign: "left",
                }}
            >
                <ReactMarkdown>{description || ""}</ReactMarkdown>
            </div>

            {/* ✅ Go to Blogs Button */}
            <div style={{ textAlign: "center", marginTop: "40px" }}>
                <button
                    onClick={() => navigate("/blogs")}
                    style={{
                        padding: "10px 25px",
                        borderRadius: "8px",
                        border: "2px solid #4CAF50",
                        backgroundColor: "transparent",
                        color: "#4CAF50",
                        fontSize: "1rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#eaf8ec")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                    ← Go to Blogs
                </button>
            </div>
        </div>
    );
};

export default BlogDetails;
