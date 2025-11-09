import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/v1/user/register", {
                username: inputs.name,
                email: inputs.email,
                password: inputs.password,
            });
            if (data.success) {
                toast.success("User Registered Successfully");
                navigate("/login");
            } else {
                toast.error(data?.message || "Registration failed");
            }
        } catch (error) {
            const msg = error?.response?.data?.message || "Registration failed";
            toast.error(msg);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                background: "linear-gradient(to bottom right, #fdfbfb, #ebedee)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}
        >
            <form onSubmit={handleSubmit}>
                <Box
                    maxWidth={420}
                    width="90%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    padding={4}
                    borderRadius={4}
                    sx={{
                        backgroundColor: "#ffffff",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            color: "#333",
                        }}
                        padding={2}
                        textAlign="center"
                    >
                        Register
                    </Typography>

                    <TextField
                        label="Name"
                        value={inputs.name}
                        onChange={handleChange}
                        name="name"
                        margin="normal"
                        type="text"
                        required
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#ccc" },
                                "&:hover fieldset": { borderColor: "#555" },
                                "&.Mui-focused fieldset": { borderColor: "#555" },
                            },
                        }}
                    />

                    <TextField
                        label="Email"
                        value={inputs.email}
                        name="email"
                        margin="normal"
                        type="email"
                        required
                        onChange={handleChange}
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#ccc" },
                                "&:hover fieldset": { borderColor: "#555" },
                                "&.Mui-focused fieldset": { borderColor: "#555" },
                            },
                        }}
                    />

                    <TextField
                        label="Password"
                        value={inputs.password}
                        name="password"
                        margin="normal"
                        type="password"
                        required
                        onChange={handleChange}
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#ccc" },
                                "&:hover fieldset": { borderColor: "#555" },
                                "&.Mui-focused fieldset": { borderColor: "#555" },
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            marginTop: 3,
                            padding: "10px",
                            fontSize: "16px",
                            backgroundColor: "#1976d2",
                            ":hover": { backgroundColor: "#145ca1" },
                        }}
                    >
                        Register
                    </Button>

                    <Button
                        onClick={() => navigate("/login")}
                        sx={{
                            borderRadius: 2,
                            marginTop: 2,
                            color: "#1976d2",
                            fontSize: "14px",
                        }}
                    >
                        Already registered? Login
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default Register;
