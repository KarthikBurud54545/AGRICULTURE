import React from "react";
import { Paper, Container, Typography } from "@mui/material";

const Footer = ({ visible }) => {
  return (
    <Paper
      square
      elevation={3}
      style={{
        backgroundColor: "#0f5132",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="body1"
          align="center"
          style={{ padding: "20px 0", color: "#fff" }}
        >
          &copy;
        </Typography>
      </Container>
    </Paper>
  );
};

export default Footer;
