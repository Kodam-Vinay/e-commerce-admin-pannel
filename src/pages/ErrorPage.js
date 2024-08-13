import React from "react";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import CustomButton from "../utils/CustomButton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import erroImage from "../assets/error_image.png";

export default function ErrorPage() {
  const navigate = useNavigate();
  const prevPath = useSelector(
    (store) => store?.persistSliceReducer?.path?.activePath
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Container maxWidth="md">
        <Grid
          container
          className="flex flex-col items-center justify-center space-y-5"
        >
          <img
            src={erroImage}
            alt="error"
            width={500}
            height={250}
            className="animate-pulse"
          />
          <Typography variant="h6" className="text-center w-full">
            The page you’re looking for doesn’t exist.
          </Typography>
          <CustomButton
            label="Back"
            onClick={() => navigate(prevPath)}
            className={"w-full max-w-96 h-10"}
          />
        </Grid>
      </Container>
    </Box>
  );
}
