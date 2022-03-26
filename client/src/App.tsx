import axios from "axios";
import Login from "components/Authentication/Login/Login";
import Register from "components/Authentication/Register/Register";
import { theme } from "helpers/theme/theme";
import { useAuth } from "hooks/auth/useAuth";
import { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Wrapper } from "./App.style";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const App = () => {
	const { user } = useAuth();

	useEffect(() => {
		console.log({ user });
	}, [user]);

	return (
		<div className="App">
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<Wrapper>
						<Routes>
							<Route
								path="/"
								element={
									<Suspense fallback={<></>}>
										<Login />
										<Register />
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
