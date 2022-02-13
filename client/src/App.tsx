import axios from "axios";
import NewTicket from "components/Ticker/Tickets/NewTicket/NewTicket";
import { theme } from "helpers/theme/theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Wrapper } from "./App.style";

axios.defaults.baseURL = "http://localhost:5000";

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                {/* <Navigation /> */}
                <ThemeProvider theme={theme}>
                    <Wrapper>
                        <Routes>
                            <Route path="/" element={<NewTicket />} />
                        </Routes>
                    </Wrapper>
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
};

export default App;
