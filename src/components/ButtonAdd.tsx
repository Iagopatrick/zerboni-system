import { Button, Typography } from "@mui/material";
import { colors } from "../constans/colors";

export const ButtonAdd: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className = "", ...props }) => {
  return (
    <Button
      sx={{
        backgroundColor: "white",
        flex: "flex",
        alignItems: "center",
        color: colors.secondary,
        borderRadius: "16px",
        width: "160px",
        padding: "5px 2px",
        height: "36px",
        boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        fontSize={"14px"}
        fontFamily="Inter"
        fontWeight={600}
        textTransform="none"
      >
        {children}
      </Typography>
    </Button>
  );
};
