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
  hideEdit?: boolean;
  hideRemove?: boolean;
}

export const ActionButtons = (props: ActionButtonsProps) => {
  const { onInfo, onRemove, onEdit, hideEdit, hideRemove } = props;
  return (
    <div className="flex gap-2 items-center">
      <IconButton aria-label="delete">
        <Typography
          sx={{
            fontSize: "16px",
            borderRadius: "50%",
            color: colors.secondary,
          }}
          onClick={() => onInfo?.()}
        >
          <FaInfo />
        </Typography>
      </IconButton>
      {!hideEdit && (
        <IconButton aria-label="edit">
          <Typography
            sx={{
              fontSize: "16px",
              borderRadius: "50%",
              color: colors.secondary,
            }}
            onClick={() => onEdit?.()}
          >
            <FaEdit />
          </Typography>
        </IconButton>
      )}
      {!hideRemove && (
        <IconButton aria-label="delete">
          <Typography
            sx={{
              fontSize: "16px",
              borderRadius: "50%",
              color: colors.secondary,
            }}
            onClick={() => onRemove?.()}
          >
            <FaTrash />
          </Typography>
        </IconButton>
      )}
    </div>
  );
};
