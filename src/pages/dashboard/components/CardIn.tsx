import { Box, Typography } from "@mui/material";
import { colors } from "../../../constans/colors";
import flowerBg from "../../../assets/images/flower2.svg";
export const CardCashflowIn = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: colors.primary,
        backgroundImage: `url(${flowerBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right bottom",
        backgroundSize: "180px",
        borderRadius: "16px",
        height: "140px",
        width: "350px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "24px",
        gap: "8px",
        overflow: "hidden",
      }}
    >
      <Typography
        fontSize={"24px"}
        className="font-inter"
        sx={{
          color: "white",
        }}
        fontWeight={600}
      >
        {title}
      </Typography>
      <Typography
        fontSize={"48px"}
        fontWeight={700}
        className="font-inter"
        sx={{
          color: "white",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};
