import { ErrorBoundary } from "@sentry/react";
import Login from "components/Authentication/Login/Login";
import Private from "components/Authentication/Private";
import Register from "components/Authentication/Register/Register";
import Navigation from "components/Navigation/Navigation";
import { theme } from "helpers/theme/theme";
import useReconcileSession from "hooks/auth/useReconcileSession";
import useSentry from "hooks/useSentry";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Wrapper } from "./App.style";
const NewTickets = lazy(() => import("components/NewTicket/NewTickets/NewTickets"));

const App = () => {
	useReconcileSession();
	useSentry();

	return (
		<div className="App">
			<ThemeProvider theme={theme}>
				<Wrapper>
					<Navigation />
					<Routes>
						<Route
							path="/tickets/new"
							element={
								<Suspense fallback={<></>}>
									<ErrorBoundary fallback={<></>}>
										<Private component={<NewTickets />} />
									</ErrorBoundary>
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
		</div>
	);
};

export default App;
