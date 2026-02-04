import { Box, LinearProgress, Typography } from "@mui/material";
import { colors } from "../../../constans/colors";

import { createTheme } from "@mui/material/styles";
import "@mui/material/styles";

const PaymentMethod = ({
  type,
  percentage,
}: {
  type: string;
  percentage: number;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography sx={{ color: colors.secondary }}>{type}</Typography>
      <LinearProgress
        value={percentage}
        variant="determinate"
        color="warning"
        sx={{ height: "10px", borderRadius: "4px", width: "100px" }}
      />
      <Typography variant="body2" color={colors.secondary} sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        {`${Math.round(percentage)}%`}
      </Typography>
    </Box>
  );
};

export const CardPayments = ({ payments }: { payments: any[] }) => {
  return (
    <Box
      sx={{
        width: "1000px",
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "16px",
        marginTop: "32px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Typography className="font-inter" fontSize={"20px"}>
        Meios de Venda
      </Typography>
      <Box
        sx={{
          justifyContent: "space-between",
          display: "flex",
          gap: "24px",
          padding: "4px",
          alignItems: "center",
          width: "100%",
        }}
      >
        {payments.map((payment) => (
          <PaymentMethod
            key={payment.type}
            type={payment.type}
            percentage={payment.percentage}
          />
        ))}
      </Box>
    </Box>
  );
};
