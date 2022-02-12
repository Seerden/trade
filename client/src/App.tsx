import axios from "axios";
import Login from "components/Login/Login";
import Navigation from "components/Navigation/Navigation";
import Ticker from "components/Ticker/Ticker";
import Tickers from "components/Ticker/Tickers";
import UserPage from "components/User/UserPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as S from "./App.style";

axios.defaults.baseURL = "http://localhost:5000";

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <Navigation />
                <S.Wrapper>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="u/:username" element={<UserPage />} />
                        <Route path="tickets">
                            <Route index element={<></>} />
                        </Route>
                        <Route path="ticker" element={<Tickers />} />
                        <Route path="ticker/:tickerId" element={<Ticker />} />
                    </Routes>
                </S.Wrapper>
            </BrowserRouter>
        </div>
    );
};

export default App;
