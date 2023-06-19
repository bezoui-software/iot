import { Box, Paper, styled, IconButton } from "@mui/material";
import { Warning, Info, Error, Close } from "@mui/icons-material";
import { database } from "../lib/firebase";
import { remove, ref } from "firebase/database";
import { useEffect, useState } from "react";

const getNotificationStyles = (theme, type) => {
  let backgroundColor, textColor, iconColor;

  switch (type) {
    case "warning":
      backgroundColor = theme.palette.warning.light;
      textColor = theme.palette.warning.dark;
      iconColor = theme.palette.warning.main;
      break;
    case "info":
      backgroundColor = theme.palette.info.light;
      textColor = theme.palette.info.dark;
      iconColor = theme.palette.info.main;
      break;
    default:
      backgroundColor = theme.palette.error.light;
      textColor = theme.palette.error.dark;
      iconColor = theme.palette.error.main;
      break;
  }

  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "start",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    backgroundColor,
    color: textColor,
    width: "400px",

    "& svg": {
      color: iconColor,
      marginRight: theme.spacing(1),
    },
  };
};

const NotificationItemContainer = styled(Paper)(({ theme, type }) =>
  getNotificationStyles(theme, type)
);

export default function NotificationItem({ id, type, children, time }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteNotification = () => {
    if (isDeleting) return;

    setIsDeleting(true);

    // Delete notification from the database
    const dbRef = ref(database, `notifications/${id}`);
    remove(dbRef)
      .then(() => {
        console.log("Notification deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  let icon;

  switch (type) {
    case "warning":
      icon = <Warning />;
      break;
    case "info":
      icon = <Info />;
      break;
    default:
      icon = <Error />;
      break;
  }

  return (
    <NotificationItemContainer display="flex" flexDirection="row" type={type}>
      <Box display="flex" justifyContent="center" alignItems="center">
        {icon}
      </Box>
      <Box display="flex" justifyContent="start" flexDirection="column" className="flex flex-col justify-start items-center">
        <Box>{children}</Box>
        <Box color="rgba(0, 0, 0, 0.5)" fontSize={12}>
          {time}
        </Box>
      </Box>
      <Box marginLeft="auto">
        <IconButton color="inherit"  onClick={handleDeleteNotification} disabled={isDeleting} display="flex" justifyContent="center" alignItems="center">
          <Close />
        </IconButton>
      </Box>
    </NotificationItemContainer>
  );
}
