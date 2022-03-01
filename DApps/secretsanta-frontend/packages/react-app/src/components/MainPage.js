import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

function MainPage() {
  const Background = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  }));

  return (
    <Background>
      <a href="https://ethereum.org/developers/#getting-started" style={{ marginTop: "8px" }}>
        Learn Ethereum
      </a>
    </Background>
  )
}

export default MainPage;
