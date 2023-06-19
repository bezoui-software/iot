import { useState, useEffect } from 'react';
import { database } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off, set } from 'firebase/database';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

export default function RemoteStopSwitch() {
  const [arretDistance, setArretDistance] = useState(false);
  const dbRef = ref(database);

  useEffect(() => {
    const arretDistanceRef = child(dbRef, 'arret_a_distance');
    const arretDistanceListener = onValue(arretDistanceRef, (snapshot) => {
      const value = snapshot.val();
      setArretDistance(value === 1);
    });

    return () => {
      off(arretDistanceRef, 'value', arretDistanceListener);
    };
  }, []);

  const handleSwitchChange = (event) => {
    const { checked } = event.target;
    setArretDistance(checked);
    updateFirebaseDatabase(checked ? 1 : 0);
  };

  const updateFirebaseDatabase = (value) => {
    try {
      set(child(dbRef, 'arret_a_distance'), value);
      console.log('Firebase database updated successfully');
    } catch (error) {
      console.log('Error updating Firebase database:', error);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1} bgcolor="#f5f5f5" padding={2} borderRadius={8} className="w-full md:w-5">
      <IconButton color={arretDistance ? 'primary' : 'default'}>
        <PowerSettingsNewIcon />
      </IconButton>
      <FormControlLabel
        control={<Switch checked={arretDistance} onChange={handleSwitchChange} />}
        label="Arret a distance"
      />
    </Box>
  );
};
