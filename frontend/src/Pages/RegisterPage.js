import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  Grid,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/send-otp",
        { email }
      );
      if (response.data.success === false) {
        setMessage(response.data.message);
      } else {
        setMessage(response.data.message);
        setOtpSent(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/register",
        {
          email,
          otp,
          username,
          password,
        }
      );
      setMessage(response.data.message);
      if (response.data.success) {
        navigate("/login");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 2, padding: 2 }}>
      <Paper elevation={6} sx={{ padding: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ textAlign: "center", marginBottom: 1 }}
        >
          Register
        </Typography>
        <Box component="form" onSubmit={handleRegister} noValidate>
          <Grid container spacing={1.2}>
            <Grid item xs={12} sm={9}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Button
                onClick={handleSendOtp}
                variant="contained"
                color="primary"
                disabled={otpSent || !email}
                size="small"
              >
                Send OTP
              </Button>
            </Grid>
            {otpSent && (
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  autoComplete="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                id="password"
                label="Password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ marginTop: 1 }}
              >
                Register
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ textAlign: "center", marginTop: 1 }}>
                Already registered? <Link to="/login">Login</Link>
              </Typography>
            </Grid>
          </Grid>
          {message && (
            <Typography
              color="error"
              variant="body2"
              sx={{ marginTop: 2, textAlign: "center" }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
