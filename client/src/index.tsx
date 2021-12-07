require('file-loader?name=[name].[ext]!./index.html');

import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { QueryClientProvider, QueryClient } from 'react-query';

import './index.scss';
import App from './App';

const queryClient = new QueryClient();


function Root({ children }: { children: JSX.Element }) {
    return (
        <RecoilRoot>
            {children}
        </RecoilRoot>
    )
}

const rootElement = document.getElementById('root');

ReactDOM.render(
    <StrictMode>
        <Root>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </Root>
    </StrictMode>,
    rootElement)