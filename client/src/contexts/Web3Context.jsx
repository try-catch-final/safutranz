import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3 } from 'web3';

const Web3Context = createContext(undefined);

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);

    // Initialize Web3 and check for existing connection
    useEffect(() => {
        const initializeWeb3 = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);

                    // Check if already connected
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
                        setChainId(parseInt(currentChainId, 16).toString());
                        setIsConnected(true);
                    }

                    // Listen for account changes
                    window.ethereum.on('accountsChanged', (accounts) => {
                        if (accounts.length === 0) {
                            setAccount(null);
                            setIsConnected(false);
                        } else {
                            setAccount(accounts[0]);
                            setIsConnected(true);
                        }
                    });

                    // Listen for chain changes
                    window.ethereum.on('chainChanged', (chainId) => {
                        setChainId(parseInt(chainId, 16).toString());
                    });

                    // Listen for disconnect
                    window.ethereum.on('disconnect', () => {
                        setAccount(null);
                        setChainId(null);
                        setIsConnected(false);
                    });

                } catch (error) {
                    console.error('Failed to initialize Web3:', error);
                    setError('Failed to initialize Web3');
                }
            }
        };

        initializeWeb3();
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            setError('No wallet provider found. Please install MetaMask or another wallet.');
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }

            const account = accounts[0];
            setAccount(account);

            // Get current chain ID
            const currentChainId = await window.ethereum.request({
                method: 'eth_chainId'
            });
            setChainId(parseInt(currentChainId, 16).toString());

            setIsConnected(true);

            // Store connection in localStorage
            localStorage.setItem('walletConnected', 'true');
            localStorage.setItem('walletAddress', account);

        } catch (error) {
            setError(error.message || 'Failed to connect wallet');
            setIsConnected(false);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setChainId(null);
        setIsConnected(false);
        setError(null);

        // Clear localStorage
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
    };

    const switchNetwork = async (targetChainId) => {
        if (!window.ethereum) {
            setError('No wallet provider found');
            return;
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${parseInt(targetChainId).toString(16)}` }],
            });
        } catch (error) {
            // If the network doesn't exist, add it
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [getNetworkConfig(targetChainId)],
                    });
                } catch (addError) {
                    setError('Failed to add network');
                }
            } else {
                setError('Failed to switch network');
            }
        }
    };

    const signMessage = async (message) => {
        if (!web3 || !account) {
            throw new Error('Wallet not connected');
        }

        try {
            const signature = await web3.eth.personal.sign(message, account, '');
            return signature;
        } catch (error) {
            throw new Error('Failed to sign message: ' + error.message);
        }
    };

    const getNetworkConfig = (chainId) => {
        const networks = {
            '1': {
                chainId: '0x1',
                chainName: 'Ethereum Mainnet',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://mainnet.infura.io/v3/your-project-id'],
                blockExplorerUrls: ['https://etherscan.io']
            },
            '56': {
                chainId: '0x38',
                chainName: 'Binance Smart Chain',
                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                rpcUrls: ['https://bsc-dataseed.binance.org'],
                blockExplorerUrls: ['https://bscscan.com']
            },
            '137': {
                chainId: '0x89',
                chainName: 'Polygon',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com']
            }
        };

        return networks[chainId] || networks['1'];
    };

    const value = {
        web3,
        account,
        chainId,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        signMessage,
        error
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
}; 