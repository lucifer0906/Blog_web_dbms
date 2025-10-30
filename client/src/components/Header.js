// Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Avatar,
    Tooltip,
} from "@mui/material";
import {
    Article as ArticleIcon,
    Create as CreateIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Login as LoginIcon,
    Menu as MenuIcon,
    MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";

import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED = 80;
const TOPBAR_HEIGHT = 64;

const navItemsAll = [
    { label: "Blogs", to: "/blogs", icon: <ArticleIcon />, auth: false },
    { label: "My Blogs", to: "/my-blogs", icon: <PersonIcon />, auth: true },
    { label: "Create Blog", to: "/create-blog", icon: <CreateIcon />, auth: true },
];

const Header = () => {
    // auth state
    let isLogin = useSelector((state) => state.isLogin);
    isLogin = isLogin || localStorage.getItem("userId");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // UI state
    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState(location.pathname || "/blogs");
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
        setActive(location.pathname || "/blogs");
    }, [location.pathname]);

    // scroll listener for header color change
    useEffect(() => {
        const handleScroll = () => {
            setScrollTop(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // update body padding
    useEffect(() => {
        const applyPadding = () => {
            const left = collapsed ? `${SIDEBAR_COLLAPSED}px` : `${SIDEBAR_WIDTH}px`;
            document.body.style.paddingLeft = left;
            document.body.style.paddingTop = `${TOPBAR_HEIGHT}px`;
        };
        applyPadding();
        return () => {
            document.body.style.paddingLeft = "";
            document.body.style.paddingTop = "";
        };
    }, [collapsed]);

    const handleLogout = () => {
        try {
            dispatch(authActions.logout());
            toast.success("Logout Successfully");
            navigate("/login");
            localStorage.clear();
        } catch (error) {
            console.log(error);
        }
    };

    const userId = localStorage.getItem("userId") || "";
    const initial = userId ? String(userId).charAt(0).toUpperCase() : "B";

    return (
        <>
            {/* Sidebar */}
            <Box
                component="aside"
                sx={{
                    width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
                    minWidth: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bgcolor: "rgba(8,10,18,0.86)",
                    color: "white",
                    backdropFilter: "blur(6px)",
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 2,
                    px: 1,
                    zIndex: 1300,
                    transition: "width 300ms ease",
                }}
            >
                {/* Logo + Collapse */}
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: collapsed ? "center" : "space-between",
                        px: 2,
                        mb: 3,
                        gap: 1,
                    }}
                >

                    {!collapsed && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {/* Logo box */}
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Grid pattern overlay */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        backgroundSize: "8px 8px",
                                        backgroundImage:
                                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                                    }}
                                />
                                {/* Letter B */}
                                <Typography
                                    sx={{
                                        color: "white",
                                        fontWeight: 900,
                                        fontSize: 22,
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    B
                                </Typography>
                            </Box>

                            {/* Text */}
                            <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    BlogHub
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "rgba(255,255,255,0.65)",
                                        display: "block",
                                        marginTop: 0.5,
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Write
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "rgba(255,255,255,0.65)",
                                        display: "block",
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Share
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "rgba(255,255,255,0.65)",
                                        display: "block",
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Inspire
                                </Typography>
                            </Box>

                        </Box>
                    )}

                    {/* Collapse button */}
                    <IconButton
                        onClick={() => setCollapsed((s) => !s)}
                        sx={{
                            color: "white",
                            bgcolor: "rgba(255,255,255,0.03)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                        }}
                        size="small"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                </Box>


                <Divider sx={{ width: "90%", borderColor: "rgba(255,255,255,0.06)" }} />

                {/* Navigation */}
                <List sx={{ width: "100%", mt: 1, flex: "1 1 auto" }}>
                    {/* Always visible: Blogs */}
                    <ListItemButton
                        component={Link}
                        to="/blogs"
                        selected={active === "/blogs" || active === "/"}
                        onClick={() => setActive("/blogs")}
                        sx={{
                            justifyContent: collapsed ? "center" : "flex-start",
                            px: 2,
                            py: 1.2,
                            mb: 1,
                            borderRadius: 1,
                            bgcolor:
                                active === "/blogs" || active === "/"
                                    ? "linear-gradient(90deg, rgba(123,58,213,0.12), rgba(74,0,224,0.06))"
                                    : "transparent",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.04)", transform: "translateY(-2px)" },
                            transition: "all 180ms ease",
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, color: "white" }}>
                            <ArticleIcon />
                        </ListItemIcon>
                        {!collapsed && <ListItemText primary="Blogs" sx={{ fontWeight: 700 }} />}
                    </ListItemButton>

                    {/* Auth-only items */}
                    {isLogin && navItemsAll
                        .filter((n) => n.auth)
                        .map((item) => (
                            <ListItemButton
                                key={item.to}
                                component={Link}
                                to={item.to}
                                selected={active === item.to}
                                onClick={() => setActive(item.to)}
                                sx={{
                                    justifyContent: collapsed ? "center" : "flex-start",
                                    px: 2,
                                    py: 1.2,
                                    mb: 1,
                                    borderRadius: 1,
                                    bgcolor: active === item.to ? "rgba(123,58,213,0.08)" : "transparent",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.04)", transform: "translateY(-2px)" },
                                    transition: "all 180ms ease",
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, color: "white" }}>
                                    {item.icon}
                                </ListItemIcon>
                                {!collapsed && <ListItemText primary={item.label} sx={{ fontWeight: 700 }} />}
                            </ListItemButton>
                        ))}
                </List>

                <Divider sx={{ width: "90%", borderColor: "rgba(255,255,255,0.06)" }} />

                {/* Bottom: Auth */}
                <Box sx={{ width: "100%", px: 1, py: 1 }}>
                    {!isLogin ? (
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                flexDirection: collapsed ? "column" : "row",
                            }}
                        >
                            <Button
                                component={Link}
                                to="/login"
                                startIcon={<LoginIcon />}
                                fullWidth
                                sx={{
                                    textTransform: "none",
                                    color: "white",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                {!collapsed && "Login"}
                            </Button>
                            <Button
                                component={Link}
                                to="/register"
                                variant="contained"
                                fullWidth
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    backgroundImage: "linear-gradient(90deg,#7b1fa2,#4a148c)",
                                }}
                            >
                                {!collapsed && "Register"}
                            </Button>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 1,
                                textAlign: "center",
                            }}
                        >
                            <Avatar sx={{ bgcolor: "#7b1fa2", width: 36, height: 36 }}>
                                {initial}
                            </Avatar>
                            {!collapsed && (
                                <>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        {userId || "Member"}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "rgba(255,255,255,0.6)", display: "block" }}
                                    >
                                        Member
                                    </Typography>
                                </>
                            )}
                            <Button
                                onClick={handleLogout}
                                startIcon={<LogoutIcon />}
                                fullWidth
                                sx={{
                                    mt: 1,
                                    textTransform: "none",
                                    color: "white",
                                    fontWeight: 700,
                                    backgroundImage: "linear-gradient(90deg,#7b1fa2,#4a148c)",
                                }}
                            >
                                {!collapsed && "Logout"}
                            </Button>
                        </Box>
                    )}
                </Box>

            </Box>

            {/* Topbar */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
                    width: `calc(100% - ${collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH}px)`,
                    height: TOPBAR_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    px: 3,
                    bgcolor:
                        scrollTop > 20
                            ? "white"
                            : "rgba(8,10,18,0.88)",
                    color: scrollTop > 20 ? "black" : "white",
                    backdropFilter: scrollTop > 20 ? "none" : "blur(6px)",
                    transition: "all 0.3s ease",
                    borderBottom: scrollTop > 20 ? "1px solid rgba(0,0,0,0.08)" : "none",
                    zIndex: 1200,
                    fontWeight: 700,
                }}
            >
                <Typography variant="h6">
                    {active.startsWith("/blogs/")
                        ? "Blog Details"
                        : navItemsAll.find((n) => n.to === active)?.label || "BlogHub"}
                </Typography>
            </Box>
        </>
    );
};

export default Header;
