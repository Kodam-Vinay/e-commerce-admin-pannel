import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModalConfirmState,
  toggleModalState,
} from "../../redux/slices/modalSlice";

export default function ConfirmationModal() {
  const dispatch = useDispatch();

  const content = useSelector((store) => store?.modal?.content);

  const handleOnClickDelete = () => {
    dispatch(toggleModalConfirmState(true));
    dispatch(toggleModalState(false));
  };
  return (
    <>
      <DialogTitle>
        <WarningRoundedIcon />
        Confirmation
      </DialogTitle>
      <Divider />
      <DialogContent>{content?.message}</DialogContent>
      <DialogActions>
        <Button variant="solid" color="danger" onClick={handleOnClickDelete}>
          {content?.buttonName}
        </Button>
        <Button
          variant="plain"
          color="neutral"
          onClick={() => dispatch(toggleModalState(false))}
        >
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}
