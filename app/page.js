"use client";
import React, { useState, useEffect } from "react";

import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Chip } from "@mui/material";
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';


import { formatEther, parseUnits } from "@ethersproject/units";
import abi from "./abi.json"
import { ethers } from "ethers";



const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'red',
};
function RedBar() {
  return (
    <Box
      sx={{
       
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 0, 0, 0.1)'
            : 'rgb(255 132 132 / 25%)',
      }}
    />
  );
}



const [metaMask, hooks] = initializeConnector(
  actions => new MetaMask({ actions })
);
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
  hooks;
const contractChain = 11155111;

const contractAddress = "0xc9ba564dA374CEa0003dE3A2e530EfF274A5f2e4";

export default function Page() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActive = useIsActive();

  const provider = useProvider();
  const [error, setError] = useState(undefined);

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect  to metamask");
    });
  }, []);


  const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

    const [balance, setBalance] = useState("");
    useEffect(() =>{
      const fetchBalance = async()=> {
        const signer = provider.getSigner();
        const smartContract = new ethers.Contract(contractAddress,abi,signer)
        const myBalance = await smartContract.balanceOf(accounts[0])
        console.log(formatEther(myBalance));
        setBalance(formatEther(myBalance))
      };

      if (isActive){
        fetchBalance();

      }
    }, [isActive])


    const [MyToken, setMyToken] = useState(0);

    const handleSetMyToken = event => {
      setMyToken(event.target.value);
    }
    
    const [toAddress, setToAddress] = useState('');
const [amount, setAmount] = useState('');

const transferToAccount = async () => {
  try {
    // Validate input
    if (!toAddress || !amount) {
      console.error('Please enter both address and amount');
      return;
    }

    // Convert amount to units
  

    // Transfer tokens
    const signer = provider.getSigner();
    const smartContract = new ethers.Contract(contractAddress, abi, signer);

    const result = await smartContract.transfer(toAddress,amount);
    console.log('Transaction result:', result);
  } catch (error) {
    console.error('Error transferring funds:', error);
  }
};  

   


      useEffect(() => {
        void metaMask.connectEagerly().catch(() => {
          console.debug("Failed to connect  to metamask");
        });
      }, []);

      const handleConnect = () => {
        metaMask.activate(contractChain);
      };

      const handleDisconnect = () => {
        metaMask.resetState();
      };
    

  return (
    <div>
      
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <p>chainId: {chainId}</p>
          </Typography> 

           
       
       {isActive ? (
              <Stack direction="row" spacing={1}>
            <Chip label={accounts ? accounts[0] : ""} variant="outlined" />
    
          <Button color="inherit" onClick={handleDisconnect}>
                Disconnect
              </Button> </Stack>
            ) : (
              <Button color="inherit" onClick={handleConnect}>
                Connect
              </Button>
            )}
      

        </Toolbar>
      </AppBar>

          {isActive && (
        <Container maxWidth="sm" sx={{ mt: 2 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  My wallet balance
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Address"
                  value={accounts[0]}
                  variant="outlined"
                />
                <TextField
                  id="outlined-basic"
                  label = "My Balance"
                  value={balance}
                  variant="outlined"
                />

                <Divider />
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Transfer To Account
                </Typography>


      
                  <TextField
                  input type="text"
                  label = "To"
                  value={toAddress}
                  variant="outlined"
                  onChange={(e) => setToAddress(e.target.value)}
         
                />



                <TextField
                  
                  required
                  id="outlined-required"
                  label = "Amount"
                  defaultValue={amount}
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}
            
                />

                 

                <Button onClick={transferToAccount}>
                  SEND
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      )}

    </Box>



    </div>
  );
}
// w3school - React Ternary operator https://www.w3schools.com/react/react_es6_ternary.asp