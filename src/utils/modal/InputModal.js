import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, DialogActions } from "@mui/material";
import { toggleModalState } from "../../redux/slices/modalSlice";
import CloseIcon from "@mui/icons-material/Close";

const InputModal = () => {
  const content = useSelector((store) => store?.modal?.content);
  const dispatch = useDispatch();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <DialogTitle>{content?.title}</DialogTitle>
        <DialogActions>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => dispatch(toggleModalState(false))}
            sx={{
              backgroundColor: "transparent",
              color: "black",
              "&:hover": {
                backgroundColor: "#f20a0a",
                color: "white",
              },
            }}
          >
            <CloseIcon />
          </Button>
        </DialogActions>
      </Box>

      <DialogContent
        sx={{
          padding: {
            xs: 0,
            sm: 2,
          },
        }}
      >
        {content?.form}
      </DialogContent>
    </>
  );
};

export default InputModal;
