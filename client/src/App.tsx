import Login from "components/Login/Login";
import NewTicket from "components/NewTicket/NewTicket";
import { NewTickets } from "components/NewTicket/NewTickets";
import Ticker from "components/Ticker/Ticker";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="tickets">
                        <Route path="new" element={<NewTicket />} />
                        <Route path="new/multi" element={<NewTickets />} />
                    </Route>

                    <Route path="ticker/:tickerId" element={<Ticker />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
