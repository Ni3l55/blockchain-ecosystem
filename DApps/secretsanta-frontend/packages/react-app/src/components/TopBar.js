import logo from ".././santa_icon.png";
import useWeb3Modal from ".././hooks/useWeb3Modal";
import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  const [account, setAccount] = useState("");
  const [rendered, setRendered] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) {
          return;
        }

        // Load the user's accounts.
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);

        // Resolve the ENS name for the first account.
        const name = await provider.lookupAddress(accounts[0]);

        // Render either the ENS name or the shortened account address.
        if (name) {
          setRendered(name);
        } else {
          setRendered(account.substring(0, 6) + "..." + account.substring(36));
        }
      } catch (err) {
        setAccount("");
        setRendered("");
        console.error(err);
      }
    }
    fetchAccount();
  }, [account, provider, setAccount, setRendered]);

  return (
    <Button variant="contained"
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function TopBar() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main, // ff8080
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: 'auto',
  textAlign: 'center',
  color: theme.palette.text.primary,
  }));

  return (
      <Grid container alignItems="center" spacing={0} bgcolor="#fafafa">
        <Grid item xs={0} md={2}></Grid>
        <Grid item xs={3} md={2}>
          <Item>
            <img src={logo} alt="santa" className="logo" />
          </Item>
        </Grid>
        <Grid item xs={6} md={4}>
          <Item>
            <h1>Secret Santa</h1>
          </Item>
        </Grid>
        <Grid item xs={3} md={2}>
          <Item>
            <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
          </Item>
        </Grid>
        <Grid item xs={0} md={2}></Grid>
      </Grid>
  );
}

export default TopBar;
