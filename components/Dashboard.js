import { useEffect, useState } from "react";
import { getDatabase, ref, child, get, onValue, off } from "firebase/database";
import { Box, Typography, styled, IconButton, Popover } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React from "react";
import NotificationItem from "./NotificationItem";
import HistoryTable from "./HistoryTable";
import { database } from "../lib/firebase";

const DashboardContainer = styled(Box)(({ theme }) => ({
  maxWidth: "800px",
  margin: "auto",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const DashboardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
}));

const NotificationsButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const DashboardLine = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  marginBottom: theme.spacing(2),
}));

const NotificationCenter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export default function Dashboard() {
  const [historicalData, setHistoricalData] = useState([]);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const dbRef = ref(database);

    const fetchData = async () => {
      try {
        const snapshot = await get(child(dbRef, "history"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const history = Object.values(data);
          setHistoricalData(history);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const realtimeListener = onValue(child(dbRef, "notifications"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const notifications = Object.values(data);
        setNotifications(notifications);
      } else {
        console.log("No notifications available");
      }
    });

    fetchData();

    // Clean up the realtime listener when component unmounts
    return () => {
      off(realtimeListener);
    };
  }, []);

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const isNotificationOpen = Boolean(notificationAnchor);

  return (
    <DashboardContainer>
      <Typography variant="h2" component="h1" gutterBottom>
        <DashboardTitle variant="h3" component="h2">
          <Box flexGrow={1}>Dashboard</Box>
          <NotificationsButton onClick={handleNotificationClick}>
            <NotificationsIcon />
          </NotificationsButton>
          <Popover
            open={isNotificationOpen}
            anchorEl={notificationAnchor}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <NotificationCenter>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  type={notification.type}
                >
                  {notification.message}
                </NotificationItem>
              ))}
            </NotificationCenter>
          </Popover>
        </DashboardTitle>
        <DashboardLine />
      </Typography>
      <Carts />
      <Box mt={10}>
        <Typography variant="h4" component="h3" gutterBottom>
          History
        </Typography>
        <HistoryTable historicalData={historicalData} />
      </Box>
    </DashboardContainer>
  );
}
