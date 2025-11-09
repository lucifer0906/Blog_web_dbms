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
        coverImage: "",
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingBlog) {
            setInputs({
                title: editingBlog.title || "",
                description: editingBlog.description || "",
                media: editingBlog.media || editingBlog.image || "",
                mediaType: editingBlog.mediaType || "image",
                coverImage: editingBlog.coverImage || "",
            });
        }
    }, [editingBlog]);
    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            const { data } = await axios.post("/api/v1/blog/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (data.success) {
                setInputs((prev) => ({ ...prev, coverImage: data.url }));
                toast.success("Cover image uploaded");
            }
        } catch (err) {
            console.error(err);
            toast.error("Cover upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleInlineImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            const { data } = await axios.post("/api/v1/blog/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (data.success) {
                // Insert markdown image tag into description
                setInputs((prev) => ({
                    ...prev,
                    description: prev.description + `\n![](${data.url})\n`,
                }));
                toast.success("Inline image uploaded");
            }
        } catch (err) {
            console.error(err);
            toast.error("Inline image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!inputs.media && !inputs.coverImage) {
                toast.error("Provide a media URL or upload a cover image");
                setLoading(false);
                return;
            }
            if (editingBlog?.id) {
                // Edit mode → Update blog
                const { data } = await axios.put(`/api/v1/blog/update-blog/${editingBlog.id}`, {
                    title: inputs.title,
                    description: inputs.description,
                    media: inputs.media,
                    mediaType: inputs.mediaType,
                    coverImage: inputs.coverImage,
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
                    coverImage: inputs.coverImage,
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
                        <StyledTextField name="description" label="Content / Description (Markdown supported for inline images)" value={inputs.description} onChange={handleChange} fullWidth margin="normal" multiline rows={8} required />
                        <Box display="flex" gap={2} mt={1}>
                            <Button variant="outlined" component="label" disabled={uploading} sx={{ borderRadius: 2 }}>
                                {uploading ? "Uploading..." : "Upload Inline Image"}
                                <input type="file" accept="image/*" hidden onChange={handleInlineImageUpload} />
                            </Button>
                        </Box>
                        <Box mt={3}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Cover Image (optional)
                            </Typography>
                            {inputs.coverImage && (
                                <img src={inputs.coverImage} alt="cover" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, marginBottom: 10 }} />
                            )}
                            <Button variant="contained" component="label" color="secondary" disabled={uploading} sx={{ borderRadius: 2 }}>
                                {uploading ? "Uploading..." : inputs.coverImage ? "Change Cover" : "Upload Cover"}
                                <input type="file" accept="image/*" hidden onChange={handleCoverUpload} />
                            </Button>
                        </Box>
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
                            required={!inputs.coverImage}
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
