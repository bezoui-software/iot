import { useEffect, useState } from "react";
import { getDatabase, ref, child, get, onValue, off } from "firebase/database";
import { database } from "../lib/firebase";
import { Box, Typography, styled, IconButton, Popover } from "@mui/material";
import Carts from "../components/Carts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React from "react";
import { Warning, Info, Error } from "@mui/icons-material";
import NotificationItem from "../components/NotificationItem";
import HistoryTable from "../components/HistoryTable";
import Graph from "../components/Graph";
import TempTable from "../components/TempTable";
import RemoteStopSwitch from "../components/RemoteStopSwitch";

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
  display: "flex",
  flexDirection: "column-reverse"
}));

export default function Dashboard() {
  const [historicalData, setHistoricalData] = useState([]);
  const [outHistoricalData, setOutHistoricalData] = useState([]);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [tempData, setTempData] = useState([]);

  useEffect(() => {
    const dbRef = ref(database);

    const fetchTempData = async () => {
      try {
        const snapshot = await get(child(dbRef, "temp"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const temp = Object.values(data);
          setTempData(temp.reverse());
        } else {
          console.log("No historical data available");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchHistoricalData = async () => {
      try {
        const snapshot = await get(child(dbRef, "history"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const history = Object.values(data);
          console.log(history);
          setHistoricalData(history);
        } else {
          console.log("No historical data available");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const snapshot = onValue(child(dbRef, "notifications"), (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            let notificationList = Object.values(data);
            notificationList = notificationList.filter(item => item.timestamp);
            const sortedNotifications = notificationList.sort((a, b) => {
              console.log(a, b)
              // Convert the date and time strings to Date objects for comparison
              const dateA = new Date(a.timestamp.date + " " + a.timestamp.time);
              const dateB = new Date(b.timestamp.date + " " + b.timestamp.time);
              return dateB - dateA; // Sort in descending order (most recent first)
            });
      
            setNotifications(sortedNotifications.reverse());
          } else {
            console.log("No notifications available");
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    const realtimeListener = onValue(child(dbRef, "history"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const history = Object.values(data);
        setHistoricalData(history);
      } else {
        console.log("No historical data available");
      }
    });

    const realtimeListenerForOut = onValue(child(dbRef, "out_history"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const history = Object.values(data);
        setOutHistoricalData(history);
      } else {
        console.log("No historical data available");
      }
    });
  
    fetchHistoricalData();
    fetchNotifications();
    realtimeListener();
    realtimeListenerForOut()
    fetchTempData();
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
      <DashboardTitle variant="h3" component="h2">
        <Box flexGrow={1}>Dashboard - IFMIAC</Box>
        <NotificationsButton onClick={handleNotificationClick}>
          <NotificationsIcon />
        </NotificationsButton>
      </DashboardTitle>
      <DashboardLine />
      <RemoteStopSwitch />
      <Carts />
      <Box mt={10}>
        <Typography variant="h4" component="h3" gutterBottom>
          In History
        </Typography>
        <HistoryTable historicalData={historicalData} />
      </Box>
      <Box mt={10}>
        <Typography variant="h4" component="h3" gutterBottom>
          Out History
        </Typography>
        <HistoryTable historicalData={outHistoricalData} />
      </Box>
      <Box mt={10}>
        <Typography variant="h4" component="h3" gutterBottom>
          Temperature
        </Typography>
        <TempTable tempData={tempData} />
      </Box>
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
          {Object.keys(notifications).map((notificationKey) => {
            const notification = notifications[notificationKey];
            return (
              <NotificationItem key={notification.id} id={notificationKey} type={notification.type} time={`${notification.timestamp.date} ${notification.timestamp.time}`}>
                {notification.message}
              </NotificationItem>
            )
          }
         )}
        </NotificationCenter>
      </Popover>
    </DashboardContainer>
  );
}
