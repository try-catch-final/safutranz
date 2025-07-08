import React, { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { connect } from 'react-redux';
import { connectWallet, disconnectWallet } from '../../actions/walletAuthActions';
import {
    FaWallet,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner,
    FaSignOutAlt
} from 'react-icons/fa';
import { BsCoin, BsMeta } from 'react-icons/bs';
import { SiWalletconnect } from 'react-icons/si';

const WalletConnect = ({
    connectWallet,
    disconnectWallet,
    walletAuth
}) => {
    const { isConnected, account, chainId, connectWallet: web3Connect } = useWeb3();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleConnect = async () => {
        try {
            await web3Connect();
            if (account) {
                connectWallet({
                    walletAddress: account,
                    chainId: chainId || '1',
                    walletType: 'MetaMask'
                });
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    const handleDisconnect = () => {
        disconnectWallet();
        setShowDropdown(false);
    };

    const getWalletIcon = () => {
        const walletType = walletAuth.walletType || 'MetaMask';
        switch (walletType) {
            case 'MetaMask':
                return <BsMeta className="text-orange-500" />;
            case 'WalletConnect':
                return <SiWalletconnect className="text-blue-500" />;
            case 'Coinbase':
                return <BsCoin className="text-yellow-500" />;
            default:
                return <FaWallet className="text-gray-400" />;
        }
    };

    const getStatusIcon = () => {
        if (walletAuth.isConnecting || walletAuth.isSigning) {
            return <FaSpinner className="animate-spin text-blue-500" />;
        }
        if (walletAuth.error) {
            return <FaExclamationTriangle className="text-red-500" />;
        }
        if (isConnected && walletAuth.isConnected) {
            return <FaCheckCircle className="text-green-500" />;
        }
        return <FaWallet className="text-gray-400" />;
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const getNetworkName = (chainId) => {
        const networks = {
            '1': 'Ethereum',
            '56': 'BSC',
            '137': 'Polygon',
            '42161': 'Arbitrum',
            '10': 'Optimism'
        };
        return networks[chainId] || `Chain ${chainId}`;
    };

    if (isConnected && walletAuth.isConnected) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="db-button-color1 flex items-center space-x-2"
                    style={{ width: '200px', height: '45px' }}
                >
                    {getStatusIcon()}
                    <span className="font-medium">{formatAddress(account || '')}</span>
                    <span className="text-xs bg-green-800 px-2 py-1 rounded">
                        {getNetworkName(chainId || '1')}
                    </span>
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                        <div className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                {getWalletIcon()}
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {walletAuth.walletType || 'MetaMask'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {account}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Network:</span>
                                    <span className="text-white">{getNetworkName(chainId || '1')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Chain ID:</span>
                                    <span className="text-white">{chainId || '1'}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-700">
                                <button
                                    onClick={handleDisconnect}
                                    className="db-button w-full flex items-center justify-center space-x-2"
                                    style={{ width: '100%', backgroundColor: '#dc2626', borderColor: '#dc2626' }}
                                >
                                    <FaSignOutAlt />
                                    <span>Disconnect</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={handleConnect}
                disabled={walletAuth.isConnecting || walletAuth.isSigning}
                className="db-button-color flex items-center space-x-2"
                style={{ width: '160px', height: '45px' }}
            >
                {getStatusIcon()}
                <span className="font-medium">
                    {walletAuth.isConnecting || walletAuth.isSigning
                        ? 'Connecting...'
                        : 'Connect Wallet'
                    }
                </span>
            </button>

            {walletAuth.error && (
                <div className="absolute right-0 mt-2 w-64 bg-red-900 border border-red-700 rounded-lg p-3 text-sm text-red-200">
                    <div className="flex items-center space-x-2">
                        <FaExclamationTriangle />
                        <span>{walletAuth.error}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    walletAuth: state.walletAuth
});

export default connect(mapStateToProps, { connectWallet, disconnectWallet })(WalletConnect); 