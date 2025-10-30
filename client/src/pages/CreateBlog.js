import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Grow,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& label.Mui-focused": { color: theme.palette.primary.main },
    "& .MuiOutlinedInput-root": {
        borderRadius: 12,
        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
        "&:hover fieldset": { borderColor: theme.palette.primary.light },
        "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main, borderWidth: "2px" },
    },
}));

const CreateBlog = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editingBlog = location.state || null; // if state exists, it's edit mode
    const userId = localStorage.getItem("userId");

    const [inputs, setInputs] = useState({
        title: "",
        description: "",
        media: "",
        mediaType: "image",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingBlog) {
            setInputs({
                title: editingBlog.title || "",
                description: editingBlog.description || "",
                media: editingBlog.media || editingBlog.image || "",
                mediaType: editingBlog.mediaType || "image",
            });
        }
    }, [editingBlog]);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingBlog?.id) {
                // Edit mode → Update blog
                const { data } = await axios.put(`/api/v1/blog/update-blog/${editingBlog.id}`, {
                    title: inputs.title,
                    description: inputs.description,
                    media: inputs.media,
                    mediaType: inputs.mediaType,
                });
                if (data?.success) {
                    toast.success("Blog updated successfully!");
                    navigate(`/blogs/${editingBlog.id}`);
                }
            } else {
                // Create mode → New blog
                const { data } = await axios.post("/api/v1/blog/create-blog", {
                    title: inputs.title,
                    description: inputs.description,
                    media: inputs.media,
                    mediaType: inputs.mediaType,
                    user: userId,
                });
                if (data?.success) {
                    toast.success("New blog post published successfully!");
                    navigate("/my-blogs");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(editingBlog ? "Failed to update blog" : "Failed to create blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f2f5, #e0e5ec)", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}>
            <Grow in={true} timeout={1000}>
                <Paper elevation={10} sx={{ width: "100%", maxWidth: 650, padding: 6, borderRadius: 4, backgroundColor: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
                    <Typography variant="h3" textAlign="center" fontWeight={700} color="#000" gutterBottom>
                        {editingBlog ? "Edit Blog Post" : "Create a New Post"}
                    </Typography>
                    <Typography variant="subtitle1" textAlign="center" color="text.secondary" mb={4}>
                        {editingBlog ? "Update your blog content" : "Share your thoughts with the world."}
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <StyledTextField name="title" label="Blog Title" value={inputs.title} onChange={handleChange} fullWidth margin="normal" required />
                        <StyledTextField name="description" label="Content / Description" value={inputs.description} onChange={handleChange} fullWidth margin="normal" multiline rows={6} required />
                        <StyledTextField select name="mediaType" label="Select Media Type" value={inputs.mediaType} onChange={handleChange} fullWidth margin="normal" required>
                            <MenuItem value="image">Image</MenuItem>
                            <MenuItem value="video">Video</MenuItem>
                        </StyledTextField>
                        <StyledTextField
                            name="media"
                            label={inputs.mediaType === "image" ? "Image URL" : "Video URL"}
                            placeholder={inputs.mediaType === "image" ? "Paste image link" : "Paste video link (YouTube or MP4)"}
                            value={inputs.media}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />

                        <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} sx={{ marginTop: 4, paddingY: 1.5, fontWeight: "bold", fontSize: "18px", borderRadius: 12 }}>
                            {loading ? <CircularProgress size={24} /> : editingBlog ? "Update Blog Post" : "Publish Blog Post"}
                        </Button>
                    </form>
                </Paper>
            </Grow>
        </Box>
    );
};

export default CreateBlog;
