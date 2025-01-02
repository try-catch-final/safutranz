import React, { useState, useEffect } from 'react';

import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';

import { jwtDecode } from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';

import { setCurrentUser, logoutUser } from './actions/authActions';

import Header from './components/layout/Header.jsx';
import Header2 from './components/layout/Header2.jsx';
import Footer from './components/layout/Footer.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import PadList from './components/pad/PadList.jsx';
import PadInfo from './components/pad/PadInfo.jsx';
import CreateToken from './components/token/CreateToken.jsx';
import LaunchPad1 from './components/lunch/LaunchPad-1.jsx';
import LaunchPad2 from './components/lunch/LaunchPad-2.jsx';
import LaunchPad3 from './components/lunch/LaunchPad-3.jsx';
import LaunchPad4 from './components/lunch/LaunchPad-4.jsx';
import TokenRes from './components/token/TokenRes.jsx';
import LaunchRes from './components/lunch/LaunchRes.jsx';
import AuthSetting from './components/auth/AuthSetting.jsx';
import Login from './components/auth/Login.jsx';
import PrivateRouter from './components/common/PrivateRouter.jsx';
import FairLaunch1 from './components/fairLaunch/FairLaunch1.jsx';
import FairLaunch2 from './components/fairLaunch/FairLaunch2.jsx';

import FairLaunch3 from './components/fairLaunch/FairLaunch3.jsx';
import FairLaunch4 from './components/fairLaunch/FairLaunch4.jsx';
import FairLaunchRes from './components/fairLaunch/FairLaunchRes.jsx';

import PieChart from './PieChart.jsx';


// Check for token
const token = localStorage.jwtToken;

if (token) {
	// set the header auth
	setAuthToken(token);

	// decode token and get user info and exp
	const decoded = jwtDecode(token);

	// set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));
	// // Check for expired token
	const currentTime = Date.now() / 1000;

	if (decoded.exp < currentTime) {
		// Logout User
		store.dispatch(logoutUser());
		window.location.reload();
		// Redirect to login
	}
}

function App() {
	const [chainId, setChainId] = useState();

	useEffect(() => {
		// Check Ethereum connection on mount
		if (window.ethereum) {
			window.localStorage.setItem('chainId', parseInt(window.ethereum.chainId, 16));
			window.localStorage.setItem('userAddress', window.ethereum.selectedAddress);
			setChainId(window.localStorage.getItem('chainId'));
		}

		// Listen for Ethereum events instead of polling
		const handleAccountsChanged = (accounts) => {
			if (window.ethereum) {
				window.localStorage.setItem('chainId', parseInt(window.ethereum.chainId, 16));
				window.localStorage.setItem('userAddress', accounts[0] || '');
				setChainId(window.localStorage.getItem('chainId'));
			}
		};

		const handleChainChanged = () => {
			if (window.ethereum) {
				window.localStorage.setItem('chainId', parseInt(window.ethereum.chainId, 16));
				setChainId(window.localStorage.getItem('chainId'));
			}
		};

		if (window.ethereum) {
			window.ethereum.on('accountsChanged', handleAccountsChanged);
			window.ethereum.on('chainChanged', handleChainChanged);
		}

		return () => {
			if (window.ethereum) {
				window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
				window.ethereum.removeListener('chainChanged', handleChainChanged);
			}
		};
	}, []);
	return (
		<Provider store={store}>
			<Router>
				<div className="App">
					<div className="dark-overly">
						<Header chainId={chainId} />
						<main className="main">
							<Header2 />
							<Routes>
								<Route path="/" element={<Dashboard />} />
								<Route path="/PadList" element={<PadList />} />
								<Route path="/PadInfo/:id" element={<PadInfo />} />
								<Route path="/CreateToken" element={<CreateToken />} />
								<Route path="/LaunchPad1" element={<LaunchPad1 />} />
								<Route path="/LaunchPad2" element={<LaunchPad2 />} />
								<Route path="/LaunchPad3" element={<LaunchPad3 />} />
								<Route path="/LaunchPad4" element={<LaunchPad4 />} />
								<Route path="/TokenRes" element={<TokenRes />} />
								<Route path="/LaunchRes" element={<LaunchRes />} />
								<Route path="/authSetting" element={<PrivateRouter><AuthSetting /></PrivateRouter>} />
								<Route path="/login" element={<Login />} />
								<Route path="/FairLaunch1" element={<FairLaunch1 />} />
								<Route path="/FairLaunch2" element={<FairLaunch2 />} />
								<Route path="/FairLaunch3" element={<FairLaunch3 />} />
								<Route path="/FairLaunch4" element={<FairLaunch4 />} />
								<Route path="/FairLaunchRes" element={<FairLaunchRes />} />
								<Route path="/test" element={<PieChart />} />
							</Routes>
							<Footer />
						</main>
					</div>
				</div>
			</Router>
		</Provider>
	);
}

export default App;
