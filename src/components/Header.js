import React from 'react';
import logo from '../picture/logo.svg';
import Image from 'next/image';
import { Select, MenuItem, Box, Typography } from '@mui/material';
import { networkParams } from 'constants.js';
import { useSelector, useDispatch } from 'react-redux';
import { switchNetwork } from '../features/switch/switchSlice.js';

const Headers = () => {
  const [currentID, setCurrentId] = React.useState(5);
  const dispatch = useDispatch();
  const count = useSelector((state) => state.switchs.value);
  console.log('vgsfdsf', count);

  const handleFromChain = (e) => {
    setCurrentId(e.target.value);
    dispatch(switchNetwork(e.target.value));
  };
  return (
    <div
      style={{
        display: 'flex',
        height: '100px',
        padding: '20px 20px 20px 20px',
        backgroundColor: '#fff',
        marginBottom: '20px',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Image
          src={logo}
          sx={{ width: '153px!important', height: '40px!important' }}
        />
        <Typography></Typography>
      </Box>
      <Select
        value={currentID}
        renderValue={(value) => (
          <Box display="flex" alignItems="center">
            <Box>
              <Typography>
                {
                  Object.values(networkParams).find(
                    (assett) => assett.chainId === value,
                  ).chainName
                }
              </Typography>
            </Box>
          </Box>
        )}
        sx={{
          my: '10px',
          width: '180px',
          borderRadius: '20px',
        }}
        onChange={handleFromChain}
      >
        {Object.values(networkParams)
          .filter((network) => {
            if (network.id === 0) return true;
          })
          .map((network) => (
            <MenuItem key={network.chainId} value={network.chainId}>
              {network.chainName}
            </MenuItem>
          ))}
      </Select>
    </div>
  );
};

export default Headers;
