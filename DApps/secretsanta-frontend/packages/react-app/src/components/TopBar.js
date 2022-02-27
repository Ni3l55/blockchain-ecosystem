import logo from ".././santa_icon.png";
import useWeb3Modal from ".././hooks/useWeb3Modal";
import React, { useEffect, useState } from "react";
import { Button, Header, Image } from "./index";

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
    <Button
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

  return (
    <div>
      <Header>
        <div className="title_logo">
          <img src={logo} alt="santa" className="logo" />
          <h1>
            Secret Santa
          </h1>
        </div>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
    </div>
  );
}

export default TopBar;
