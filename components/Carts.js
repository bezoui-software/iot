import { useEffect, useState } from "react";
import { getDatabase, ref, child, get, onValue, off } from "firebase/database";
import { database } from "../lib/firebase";
import { Box, Typography, Paper, Grid, styled } from "@mui/material";

const StatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  height: "100%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  position: "relative",
}));

const Watermark = styled(Typography)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  fontSize: "0.8rem",
  opacity: 0.5,
}));

const CartNumber = styled(Typography)(({ theme }) => ({
  fontSize: "6rem",
  fontWeight: "bold",
}));

function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day];
}

export default function CartStats() {
  const [todayCount, setTodayCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);

  const dbRef = ref(database);

  useEffect(() => {
    const onDataChange = (snapshot) => {
      let todayC = 0, monthC = 0, yearC = 0;
      if (snapshot.exists()) {
        const data = snapshot.val();
        const history = Object.values(data);
        const [todayYear, todayMonth, todayDay] = getFormattedDate();
        history.forEach((item) => {
          if (!item?.timestamp?.date) return;
          const [year, month, day] = item.timestamp.date.split("-");
          if (day == todayDay && month == todayMonth && year == todayYear) {
            todayC = todayC + 1;
          }
          if (month == todayMonth && year == todayYear) {
            monthC = monthC + 1;
          }
          if (year == todayYear) {
            yearC = yearC + 1;
          }
        });
        setTodayCount(todayC);
        setMonthCount(monthC);
        setYearCount(yearC);
      } else {
        console.log("No data available");
      }
    };

    const onError = (error) => {
      console.error(error);
    };

    onValue(child(dbRef, "history"), onDataChange, onError);

    return () => {
      off(dbRef, onDataChange);
    };
  }, []);

  return (
    <Box mt={4}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <StatBox elevation={3}>
            <CartNumber variant="h4">{todayCount}</CartNumber>
            <Watermark variant="subtitle2">Today</Watermark>
          </StatBox>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox elevation={3}>
            <CartNumber variant="h4">{monthCount}</CartNumber>
            <Watermark variant="subtitle2">This Month</Watermark>
          </StatBox>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox elevation={3}>
            <CartNumber variant="h4">{yearCount}</CartNumber>
            <Watermark variant="subtitle2">This Year</Watermark>
          </StatBox>
        </Grid>
      </Grid>
    </Box>
  );
}