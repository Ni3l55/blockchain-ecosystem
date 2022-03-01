import TopBar from "./components/TopBar";
import MainPage from "./components/MainPage"
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#ef5350',
      },
      secondary: {
        main: '#fafafa',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <TopBar />
      <MainPage />
    </ThemeProvider>
  );
}

export default App;
