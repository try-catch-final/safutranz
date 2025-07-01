import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogin } from '../../actions/authActions';
import {
    FaWallet,
    FaMetaMask,
    FaConnectdevelop,
    FaExclamationTriangle,
    FaCheckCircle,
    FaSpinner
} from 'react-icons/fa';
import { SiWalletconnect } from 'react-icons/si';
import { BsCoin } from 'react-icons/bs';
import PropTypes from 'prop-types';

interface WalletLoginProps {
    userLogin: (data: any) => void;
    auth: any;
    errors: any;
}

const WalletLogin: React.FC<WalletLoginProps> = ({ userLogin, auth, errors }) => {
    const navigate = useNavigate();
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [chainId, setChainId] = useState('');
    const [walletType, setWalletType] = useState('');

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate('/authSetting');
        }
        window.scrollTo(0, 0);
    }, [auth.isAuthenticated, navigate]);

    useEffect(() => {
        if (errors && errors.wallet) {
            setErrorMessage(errors.wallet);
            setConnectionStatus('error');
        }
    }, [errors]);

    const connectMetaMask = async () => {
        setIsConnecting(true);
        setConnectionStatus('connecting');
        setErrorMessage('');
        setWalletType('MetaMask');

        try {
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed. Please install MetaMask extension.');
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('No accounts found. Please connect your wallet.');
            }

            const account = accounts[0];
            setWalletAddress(account);

            // Get chain ID
            const chainId = await window.ethereum.request({
                method: 'eth_chainId'
            });
            setChainId(parseInt(chainId, 16).toString());

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    setWalletAddress('');
                    setConnectionStatus('idle');
                } else {
                    setWalletAddress(accounts[0]);
                }
            });

            // Listen for chain changes
            window.ethereum.on('chainChanged', (chainId: string) => {
                setChainId(parseInt(chainId, 16).toString());
            });

            setConnectionStatus('success');

            // Auto-login with wallet
            const userData = {
                walletAddress: account,
                chainId: parseInt(chainId, 16).toString(),
                walletType: 'MetaMask'
            };

            userLogin(userData);

        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to connect MetaMask');
            setConnectionStatus('error');
        } finally {
            setIsConnecting(false);
        }
    };

    const connectWalletConnect = async () => {
        setIsConnecting(true);
        setConnectionStatus('connecting');
        setErrorMessage('');
        setWalletType('WalletConnect');

        try {
            // This would require WalletConnect v2 setup
            // For now, we'll show a placeholder
            setErrorMessage('WalletConnect integration coming soon');
            setConnectionStatus('error');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to connect WalletConnect');
            setConnectionStatus('error');
        } finally {
            setIsConnecting(false);
        }
    };

    const connectCoinbase = async () => {
        setIsConnecting(true);
        setConnectionStatus('connecting');
        setErrorMessage('');
        setWalletType('Coinbase');

        try {
            if (!window.ethereum) {
                throw new Error('No wallet provider found');
            }

            // Check if Coinbase Wallet is available
            if (window.ethereum.isCoinbaseWallet) {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                if (accounts.length === 0) {
                    throw new Error('No accounts found');
                }

                const account = accounts[0];
                setWalletAddress(account);
                setConnectionStatus('success');

                const userData = {
                    walletAddress: account,
                    chainId: '1', // Default to mainnet
                    walletType: 'Coinbase'
                };

                userLogin(userData);
            } else {
                throw new Error('Coinbase Wallet is not installed');
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to connect Coinbase Wallet');
            setConnectionStatus('error');
        } finally {
            setIsConnecting(false);
        }
    };

    const getStatusIcon = () => {
        switch (connectionStatus) {
            case 'connecting':
                return <FaSpinner className="animate-spin text-blue-500" />;
            case 'success':
                return <FaCheckCircle className="text-green-500" />;
            case 'error':
                return <FaExclamationTriangle className="text-red-500" />;
            default:
                return <FaWallet className="text-gray-400" />;
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'connecting':
                return `Connecting to ${walletType}...`;
            case 'success':
                return `Connected to ${walletType}`;
            case 'error':
                return errorMessage;
            default:
                return 'Choose your wallet';
        }
    };

    return (
        <div className="py-6 container">
            <div style={{ height: '16px' }} />

            <div className="bg-dark style-border ant-card ant-card-bordered">
                <div className="ant-card-body" id="walletLogin">
                    <h1 className="socials text-center" style={{ fontSize: '40px' }}>
                        Connect Wallet
                    </h1>
                    <p className="text-center text-gray-400 mt-4">
                        Connect your blockchain wallet to access SafuTranz
                    </p>

                    {/* Status Display */}
                    <div className="flex items-center justify-center mt-8 mb-6">
                        <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
                            {getStatusIcon()}
                            <span className="text-sm">{getStatusText()}</span>
                        </div>
                    </div>

                    {/* Wallet Address Display */}
                    {walletAddress && (
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-400">Connected Address:</p>
                            <p className="text-xs font-mono bg-gray-800 p-2 rounded mt-1 break-all">
                                {walletAddress}
                            </p>
                            {chainId && (
                                <p className="text-xs text-gray-500 mt-1">Chain ID: {chainId}</p>
                            )}
                        </div>
                    )}

                    {/* Wallet Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        {/* MetaMask */}
                        <button
                            onClick={connectMetaMask}
                            disabled={isConnecting}
                            className="wallet-option-btn flex flex-col items-center p-6 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <FaMetaMask className="text-2xl mb-2" />
                            <span className="font-semibold">MetaMask</span>
                            <span className="text-xs opacity-75">Most Popular</span>
                        </button>

                        {/* WalletConnect */}
                        <button
                            onClick={connectWalletConnect}
                            disabled={isConnecting}
                            className="wallet-option-btn flex flex-col items-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <SiWalletconnect className="text-2xl mb-2" />
                            <span className="font-semibold">WalletConnect</span>
                            <span className="text-xs opacity-75">Mobile Wallets</span>
                        </button>

                        {/* Coinbase Wallet */}
                        <button
                            onClick={connectCoinbase}
                            disabled={isConnecting}
                            className="wallet-option-btn flex flex-col items-center p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <BsCoin className="text-2xl mb-2" />
                            <span className="font-semibold">Coinbase</span>
                            <span className="text-xs opacity-75">Exchange Wallet</span>
                        </button>
                    </div>

                    {/* Error Display */}
                    {errorMessage && (
                        <div className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <FaExclamationTriangle className="text-red-400" />
                                <span className="text-red-200">{errorMessage}</span>
                            </div>
                        </div>
                    )}

                    {/* Traditional Login Link */}
                    <div className="text-center mt-8">
                        <p className="text-gray-400 text-sm">
                            Don't have a wallet?{' '}
                            <a
                                href="https://metamask.io/download/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline"
                            >
                                Get MetaMask
                            </a>
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                            Or{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-blue-400 hover:text-blue-300 underline"
                            >
                                use traditional login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

WalletLogin.propTypes = {
    userLogin: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state: any) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { userLogin })(WalletLogin); 