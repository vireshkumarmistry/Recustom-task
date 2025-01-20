import React from "react";
import { styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";

interface WidgetProps {
    sx?: object;
    title: string;
    amount: number;
    icon: React.ReactNode;
}

const StyledIcon = styled("div")(({ theme }) => ({
    margin: "auto",
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginBottom: theme.spacing(3),
}));

const WidgetSummary: React.FC<WidgetProps> = ({ sx, title, amount, icon }) => {
    return (
        <Card
            sx={{
                py: 5,
                boxShadow: 0,
                textAlign: "center",
                color: (theme) => theme.palette.primary.main,
                bgcolor: "#ffe6e6",
                ...sx,
            }}
        >
            <StyledIcon>{icon}</StyledIcon>
            <Typography variant="h3" gutterBottom>
                {amount}
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                {title}
            </Typography>
        </Card>
    );
};

export default WidgetSummary;
