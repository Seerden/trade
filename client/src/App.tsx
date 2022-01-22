import Login from "components/Login/Login";
import Ticker from "components/Ticker/Ticker";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="tickets">
                        <Route path="/" element={<></>} />
                    </Route>

                    <Route path="ticker/:tickerId" element={<Ticker />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
