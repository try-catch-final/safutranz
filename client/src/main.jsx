import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import "rsuite/styles/index.less";
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet, sepolia } from 'wagmi/chains';

const container = document.getElementById('root');
const root = createRoot(container);

const config = getDefaultConfig({
    appName: 'SaFuTrendz ',
    projectId: 'f8623720696031a4910a690a781428f6',
    chains: [mainnet, sepolia],
    ssr: false,
});

const queryClient = new QueryClient();

// Custom theme to match project's design system
const customTheme = darkTheme({
    accentColor: '#ffaa00',
    accentColorForeground: 'white',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'small',
});

root.render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={customTheme}>
                    <App />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>
); 