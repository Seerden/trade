import axios from "axios";
import NewTicket from "components/Ticker/Tickets/NewTicket/NewTicket";
// import NewTicket from "components/Ticker/Tickets/NewTicket/NewTicket";
import { theme } from "helpers/theme/theme";
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Wrapper } from "./App.style";
const CandleChart = lazy(() => import("./components/Charts/CandleChart/CandleChart"));
const NewTickets = lazy(() => import("components/Ticker/Tickets/NewTicket/NewTickets"));

axios.defaults.baseURL = "http://localhost:5000";

function Test() {
    const [data, setData] = useState<Record<string, any>>();
    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const { data } = await axios.get("/msft/1m/2021-10-04/2021-10-05");
                setData(data.rows.slice(350, 450));
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data]);
    return <></>;
}

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                {/* <Navigation /> */}
                <ThemeProvider theme={theme}>
                    <Wrapper>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <Suspense fallback={<></>}>
                                        <Test />
                                        <NewTicket />
                                        <NewTickets />
                                        {/* <CandleChart /> */}
                                    </Suspense>
                                }
                            />
                        </Routes>
                    </Wrapper>
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
};

export default App;
