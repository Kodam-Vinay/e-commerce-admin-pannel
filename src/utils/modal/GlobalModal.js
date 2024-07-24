import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModalConfirmState,
  toggleModalState,
} from "../../redux/slices/modalSlice";
import { MODAL_CONTENT_TYPES } from "../constants";
import ConfirmationModal from "./ConfirmationModal";
import zIndex from "@mui/material/styles/zIndex";
import InputModal from "./InputModal";

export default function GlobalModal() {
  const contentType = useSelector((store) => store?.modal?.contentType);

  const dispatch = useDispatch();
  const isModalOpen = useSelector((store) => store?.modal?.isModalOpen);
  return (
    <Modal
      open={isModalOpen}
      onClose={() => {
        dispatch(toggleModalState(false));
        dispatch(toggleModalConfirmState(false));
      }}
      sx={{
        zIndex: zIndex,
      }}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{
          zIndex: zIndex,
        }}
      >
        {contentType === MODAL_CONTENT_TYPES.deleteUser ||
        contentType === MODAL_CONTENT_TYPES.logout ? (
          <ConfirmationModal />
        ) : (
          <InputModal />
        )}
      </ModalDialog>
    </Modal>
  );
}
