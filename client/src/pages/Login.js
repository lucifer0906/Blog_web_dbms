import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [inputs, setInputs] = useState({
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
            const { data } = await axios.post("/api/v1/user/login", {
                email: inputs.email,
                password: inputs.password,
            });
            if (data.success) {
                localStorage.setItem("userId", data?.user._id);
                dispatch(authActions.login());
                toast.success("Login Successfully");
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error("Login failed");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                background:
                    "linear-gradient(to bottom right, #fdfbfb, #ebedee)",
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
                        Login
                    </Typography>

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
                                "& fieldset": {
                                    borderColor: "#ccc",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#555",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#555",
                                },
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
                                "& fieldset": {
                                    borderColor: "#ccc",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#555",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#555",
                                },
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            borderRadius: 2,
                            marginTop: 3,
                            padding: "10px",
                            fontSize: "16px",
                            backgroundColor: "#1976d2",
                            ":hover": {
                                backgroundColor: "#145ca1",
                            },
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() => navigate("/register")}
                        sx={{
                            borderRadius: 2,
                            marginTop: 2,
                            color: "#1976d2",
                            fontSize: "14px",
                        }}
                    >
                        Create New Account
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default Login;
