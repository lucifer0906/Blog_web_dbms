import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function BlogCard({
    title,
    description,
    image,
    media,
    mediaType,
    username,
    time,
    id,
    isUser,
    coverImage,
}) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/blogs/${id}`);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate("/create-blog", {
            state: { id, title, description, image, media, mediaType },
        });
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            const { data } = await axios.delete(`/api/v1/blog/delete-blog/${id}`);
            if (data?.success) {
                toast.success("Blog deleted successfully!");
                setTimeout(() => window.location.reload(), 500);
            }
        } catch (error) {
            toast.error("Failed to delete blog");
            console.error(error);
        }
    };

    // ✅ Unified media rendering with click-to-navigate behavior
    const displayMedia = () => {
        // Use media field first, fallback to image for older blogs
    const mediaUrl = coverImage || media || image || "";
        if (!mediaUrl) return null;

        // YouTube video
        if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) {
            let videoId = "";
            if (mediaUrl.includes("v=")) videoId = mediaUrl.split("v=")[1].split("&")[0];
            else if (mediaUrl.includes("youtu.be/")) videoId = mediaUrl.split("youtu.be/")[1].split("?")[0];
            return (
                <div onClick={handleCardClick} style={{ cursor: "pointer" }}>
                    <iframe
                        width="100%"
                        height="200"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video"
                        allowFullScreen={false}
                        style={{ border: "none", pointerEvents: "none" }}
                    ></iframe>
                </div>
            );
        }

        // Image file (jpg, png, gif, etc.)
        if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(mediaUrl)) {
            return (
                <CardMedia
                    component="img"
                    height="200"
                    image={mediaUrl}
                    alt={title}
                    onClick={handleCardClick}
                    sx={{ objectFit: "cover", cursor: "pointer" }}
                />
            );
        }

        // Video file (mp4, webm, ogg)
        if (/\.(mp4|webm|ogg)$/i.test(mediaUrl)) {
            return (
                <div onClick={handleCardClick} style={{ cursor: "pointer", position: "relative" }}>
                    <video
                        width="100%"
                        height="200"
                        style={{ objectFit: "cover", pointerEvents: "none" }}
                        muted
                    >
                        <source src={mediaUrl} />
                    </video>
                </div>
            );
        }

        // Default placeholder
        return (
            <CardMedia
                component="img"
                height="200"
                image="https://via.placeholder.com/400x200?text=No+Media"
                alt="No media"
                onClick={handleCardClick}
                sx={{ cursor: "pointer" }}
            />
        );
    };

    return (
        <Card
            onClick={handleCardClick}
            sx={{
                maxWidth: 400,
                margin: "auto",
                mt: 4,
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                ":hover": {
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    transform: "translateY(-5px)",
                },
                cursor: "pointer",
            }}
        >
            {isUser && (
                <Box display="flex" justifyContent="flex-end" p={1} gap={1}>
                    <IconButton onClick={handleEdit} color="info">
                        <ModeEditIcon />
                    </IconButton>
                    <IconButton onClick={handleDelete} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}

            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }}>
                        {username?.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        {username}
                    </Typography>
                }
                subheader={new Date(time).toLocaleDateString()}
            />

            {/* ✅ Display media (image/video/YouTube) */}
            {displayMedia()}

            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description.length > 120
                        ? description.slice(0, 120) + "..."
                        : description}
                </Typography>
            </CardContent>
        </Card>
    );
}
