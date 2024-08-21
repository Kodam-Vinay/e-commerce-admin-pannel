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
import useDeviceCheck from "../../hooks/useDeviceCheck";
import useDeviceResize from "../../hooks/useDeviceResize";

export default function GlobalModal() {
  const contentType = useSelector((store) => store?.modal?.contentType);
  const isMobile = useDeviceCheck();
  const dispatch = useDispatch();
  const size = useDeviceResize();
  const isModalOpen = useSelector((store) => store?.modal?.isModalOpen);
  const paths = [
    MODAL_CONTENT_TYPES.deleteUser,
    MODAL_CONTENT_TYPES.logout,
    MODAL_CONTENT_TYPES.deleteCategory,
    MODAL_CONTENT_TYPES.deleteBrand,
    MODAL_CONTENT_TYPES.deleteSubCategory,
    MODAL_CONTENT_TYPES.deleteProduct,
  ];
  return (
    <Modal
      open={isModalOpen}
      onClose={() => {
        dispatch(toggleModalState(false));
        dispatch(toggleModalConfirmState(false));
      }}
      sx={{
        zIndex: zIndex,
        border: paths?.includes(contentType)
          ? "1px solid red"
          : "1px solid #5046e5",
        backgroundColor: "transparent",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{
          zIndex: zIndex,
          width: paths?.includes(contentType)
            ? "400px"
            : isMobile || size?.width < 500
            ? "100%"
            : "500px",
          maxWidth: "500px",
        }}
      >
        {paths?.includes(contentType) ? <ConfirmationModal /> : <InputModal />}
      </ModalDialog>
    </Modal>
  );
}
