import Login from "components/Login/Login";
import Navigation from "components/Navigation/Navigation";
import Ticker from "components/Ticker/Ticker";
import Tickers from "components/Ticker/Tickers";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as S from "./App.style";

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <Navigation />
                <S.Wrapper>
                    <Routes>
                        <Route path="/" element={<Login />} />
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
