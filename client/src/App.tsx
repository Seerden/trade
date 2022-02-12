import axios from "axios";
import NewTicket from "components/Ticker/Tickets/NewTicket/NewTicket";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Wrapper } from "./App.style";

axios.defaults.baseURL = "http://localhost:5000";

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                {/* <Navigation /> */}
                <Wrapper>
                    <Routes>
                        <Route path="/" element={<NewTicket />} />
                    </Routes>
                </Wrapper>
            </BrowserRouter>
        </div>
    );
};

export default App;
