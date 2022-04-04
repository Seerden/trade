import axios from "axios";
import Login from "components/Authentication/Login/Login";
import Private from "components/Authentication/Private";
import Register from "components/Authentication/Register/Register";
import Navigation from "components/Navigation/Navigation";
import { theme } from "helpers/theme/theme";
import { useAuth } from "hooks/auth/useAuth";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Wrapper } from "./App.style";
const NewTickets = lazy(() => import("components/NewTicket/NewTickets/NewTickets"));

// TODO: dev-only baseURL - on prod we'd want to map this to the docker service
// (0.0.0.0:5000??? http://server:5000??? maybe even just the domain, like trade.seerden.dev/)
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const App = () => {
	const { user, login, logout } = useAuth();

	// Get current user session from backend. If user doesn't match with what
	// client believes it should be, log in or out, depending on response.
	useEffect(() => {
		(async function() {
			try {
				const { data } = await axios.get("/auth/me");

				// If user matches, don't do anything
				// If no user returned, logout()
				if (!data?.username) {
					logout();
				}
				// If user in session doesn't match user on client, log in with user
				// from session.
				if (data?.username !== user.username) {
					login({ username: data.username });
				}
			} catch (error) {
				// Either user isn't logged in (response 401), or something else
				// went wrong. Either way, we should log out.
				logout();
			}
		})();
	}, []);

	return (
		<div className="App">
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<Wrapper>
						<Navigation />
						<Routes>
							<Route
								path="/tickets/new"
								element={
									<Suspense fallback={<></>}>
										<Private component={<NewTickets />} />
									</Suspense>
								}
							/>

							<Route path="login" element={<Login />} />
							<Route path="register" element={<Register />} />
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
