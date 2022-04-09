require("file-loader?name=[name].[ext]!./index.html");

import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.scss";

const queryClient = new QueryClient();

function Root({ children }: { children: JSX.Element }) {
	return <RecoilRoot>{children}</RecoilRoot>;
}

const rootElement = document.getElementById("root");

ReactDOM.render(
	<StrictMode>
		<Root>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</QueryClientProvider>
		</Root>
	</StrictMode>,
	rootElement
);
