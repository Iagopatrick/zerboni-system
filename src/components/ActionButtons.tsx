import { Button, IconButton, Typography } from "@mui/material";
import { on } from "events";
import { FaInfo } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { colors } from "../constans/colors";

interface ActionButtonsProps {
  onInfo?: () => void;
  onRemove?: () => void;
  onEdit?: () => void;
}

export const ActionButtons = (props: ActionButtonsProps) => {
  const { onInfo, onRemove, onEdit } = props;
  return (
    <div className="flex gap-2 items-center">
      <IconButton aria-label="delete">
        <Typography
          sx={{ fontSize: "16px", borderRadius: "50%", color: colors.primary }}
          onClick={() => onInfo?.()}
        >
          <FaInfo />
        </Typography>
      </IconButton>
      <IconButton aria-label="delete">
        <Typography
          sx={{ fontSize: "16px", borderRadius: "50%", color: colors.primary }}
          onClick={() => onEdit?.()}
        >
          <FaEdit />
        </Typography>
      </IconButton>
      <IconButton aria-label="delete">
        <Typography
          sx={{ fontSize: "16px", borderRadius: "50%", color: colors.primary }}
          onClick={() => onRemove?.()}
        >
          <FaTrash />
        </Typography>
      </IconButton>
    </div>
  );
};
