import { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, styled } from "@mui/material";
import { Icon } from '@mui/material';
import { Temperature } from '@mui/icons-material';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';

const TemperatureText = (tempData) => {
  tempData = Object.values(tempData)[0]
  console.log(tempData)
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Icon>
          <DeviceThermostatOutlinedIcon />
        </Icon>
        <Typography fontWeight="bold">
          {(tempData[0]) ? tempData[0].temperature : 'N/A'}°C
        </Typography>
      </Box> 
    </Box>
  );
};


const TempTable = ({ tempData }) => {
  if (!tempData) return <p>No temperature data is saved</p>
  tempData = tempData.reverse()
  return (
   <Box>
    <TemperatureText tempData={tempData} />
    <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Temperature</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tempData.map((item) =>
              (
                <TableRow>
                  <TableCell>{item?.timestamp?.date}</TableCell>
                  <TableCell>{item?.timestamp?.time}</TableCell>
                  <TableCell>{item?.temperature}°C</TableCell>
                </TableRow>
              ) 
            )}
          </TableBody>
    </Table>
   </Box> 
  );
};

export default TempTable;
