import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, styled } from "@mui/material";
import React from "react";

const HistoryTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export default function HistoryTable({ historicalData }) {
  return (
    <HistoryTableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>UID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historicalData.map((item) =>
            (
              <TableRow key={item.uid}>
                <TableCell>{item.timestamp.date}</TableCell>
                <TableCell>{item.timestamp.time}</TableCell>
                <TableCell>{item.uid}</TableCell>
              </TableRow>
            ) 
          )}
        </TableBody>
      </Table>
    </HistoryTableContainer>
  );
}
