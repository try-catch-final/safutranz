import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { User, Menu, ExternalLink } from 'react-feather';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSelector } from 'react-redux';
import { useDisconnect, useAccount } from 'wagmi';

import logo from '../assets/img/logo.png';
import meta from '../assets/img/metamask.png';
import wall from '../assets/img/walletconnect.png';

import bnb from '../assets/img/bnb.png';
import avax from '../assets/img/avax.png';
import bsc from '../assets/img/bsc.png';
import cronos from '../assets/img/cronos.png';
import eth from '../assets/img/eth.png';
import matic from '../assets/img/matic.png';
import pls from '../assets/img/PLS.png';

import { Dropdown } from 'rsuite';

import Sider from './Sider';
import { FaTimesCircle } from 'react-icons/fa';

var netChainId, netText;

function Header(chainId) {
	const { isConnected } = useAccount();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [windowDimension, setWindowDimension] = useState(null);
	const [togglerr, setToggle] = useState(false);

	useEffect(() => {
		setWindowDimension(window.innerWidth);
	});

	useEffect(() => {
		function handleResize() {
			setWindowDimension(window.innerWidth);
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		setIsAuthenticated(isConnected);
	}, [isConnected]);

	switch (chainId.chainId) {
		case '1':
			netChainId = <img alt="img" src={eth} style={{ width: '18px' }} />;
			netText = 'Ethereum Mainnet';
			break;
		case '3':
			netChainId = <img alt="img" src={eth} style={{ width: '18px' }} />;
			netText = 'Ropsten Testnet';
			break;
		case '56':
			netChainId = <img alt="img" src={bnb} style={{ width: '18px' }} />;
			netText = 'BSC Mainnet';
			break;
		case '97':
			netChainId = <img alt="img" src={bsc} style={{ width: '18px' }} />;
			netText = 'BSC Testnet';
			break;
		case '43114':
			netChainId = <img alt="img" src={avax} style={{ width: '18px' }} />;
			netText = 'Avalanche Mainnet';
			break;
		case '43113':
			netChainId = <img alt="img" src={avax} style={{ width: '18px' }} />;
			netText = 'Avalanche Testnet';
			break;
		case '25':
			netChainId = <img alt="img" src={cronos} style={{ width: '18px' }} />;
			netText = 'Cronos Mainnet';
			break;
		case '941':
			netChainId = <img alt="img" src={pls} style={{ width: '18px' }} />;
			netText = 'Pulsechain Testnet';
			break;
		case '137':
			netChainId = <img alt="img" src={matic} style={{ width: '18px' }} />;
			netText = 'Polygon Mainnet';
			break;
		default:
			netChainId = '';
			netText = 'No Chain';
			break;
	}

	const isMobile = windowDimension <= 640;

	function changeSider() {
		togglerr ? setToggle(false) : setToggle(true);
	}

	return (
		<Styles.Wrapper className="navbar">
			<CSSReset />

			{isMobile ? (
				<MobileNavbar.Wrapper>
					<MobileNavbar.Logo>
						<MobileNavbar.Icon onClick={changeSider}>
							<Menu size={25} style={{ width: '40px', marginTop: '40px' }} className="nav-mobile-icon" />
						</MobileNavbar.Icon>
						<Link to="/">
							<img
								alt="img"
								src={logo}
								style={{ width: '60px', marginLeft: '10px', marginTop: '-16px' }}
							/>
						</Link>
					</MobileNavbar.Logo>
					<MobileNavbar.Items>
						{isAuthenticated === true && (
							<Dropdown title={'create'} id="nav-drop-mobile" noCaret>
								<Dropdown.Item as={Link} to="/LaunchPad1">
									Create Launch
								</Dropdown.Item>
								<Dropdown.Item as={Link} to="/FairLaunch1">
									Create FairLaunch
								</Dropdown.Item>
								<Dropdown.Item as={Link} to="/CreateToken">
									Create Token
								</Dropdown.Item>
							</Dropdown>
						)}
						<StyledConnectButton />
						{isAuthenticated === true && (
							<MobileNavbar.Item className="nav-links-mobile">
								{netChainId}
							</MobileNavbar.Item>
						)}
					</MobileNavbar.Items>
				</MobileNavbar.Wrapper>
			) : (
				<Navbar.Wrapper>
					<Navbar.Items>
						<Navbar.Icon className="nav-icon" onClick={changeSider}>
							<Menu size={30} />
						</Navbar.Icon>
						<Navbar.Logo className="nav-logo">
							<Link to="/">
								<img alt="img" src={logo} />
							</Link>
						</Navbar.Logo>
					</Navbar.Items>
					<Navbar.Items>
						{isAuthenticated === true ? (
							<Dropdown
								title={' Create'}
								icon={<User size={15} />}
								style={{ padding: '0px', marginTop: '23px', borderRadius: '12px' }}
								id="nav-drop"
							>
								<Dropdown.Item as={Link} to="/LaunchPad1">
									Create Launch
								</Dropdown.Item>
								<Dropdown.Item as={Link} to="/FairLaunch1">
									Create FairLaunch
								</Dropdown.Item>
								<Dropdown.Item as={Link} to="/CreateToken">
									Create Token
								</Dropdown.Item>
							</Dropdown>
						) : null}
						<StyledConnectButton />

					</Navbar.Items>
				</Navbar.Wrapper>
			)}

			<Sider screen={isMobile} togglettt={togglerr} />
		</Styles.Wrapper>
	);
}

const Styles = {
	Wrapper: styled.main`
		display: flex;
		background-color: #eeeeee;
		position: fixed;
		width: 100vw;
		box-shadow: 0 0 15px rgba(255, 170, 0, 0.788);
	`
};

const Navbar = {
	Wrapper: styled.nav`
		flex: 1;
		align-self: flex-start;
		padding: 1rem 2rem;
		display: flex;
		height: 80px;
		justify-content: space-between;
		align-items: center;
		background-color: #1f2126;
		border-bottom: solid 3px #ffaa00;
	`,
	Logo: styled.h1`
		padding-top: 0px;
		margin-top: 10px;
		margin-left: 20px;
		border-radius: 40px;
		height: 80px;
		width: 80px;
	`,
	Items: styled.ul`
		display: flex;
		list-style: none;
	`,
	Item: styled.li`
		cursor: pointer;
		border: none;
		border-radius: 20px;
		cursor: pointer;
		font-weight: 600;
		padding: 10px 10px;
		transition: 0.3s;
		margin-right: 15px;
		margin-top: 20px;
		text-align: center;
	`,
	Icon: styled.span`border-radius: 8px;`
};

const MobileNavbar = {
	Wrapper: styled(Navbar.Wrapper)`
    position: fixed;
    width: 100%;
    height:60px;
    background:#1f2126
    justify-content: center;
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.788);
  `,
	Items: styled(Navbar.Items)`
    float: rigth;
    justify-content: space-around;
		margin-right:1px
  `,
	Item: styled(Navbar.Item)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0px;
    margin-left: 0px;
    padding: 1px;
  `,
	Logo: styled.h1`
		padding-top: 0px;
		margin-top: -10px;
	`,
	Icon: styled.span``
};

const CSSReset = createGlobalStyle`
  *,
  *::before, 
  *::after {
    margin: 0; 
    padding: 0;
    box-sizing: inherit;
  }
  *::hover {
    background-color:green; /*will change background-color of element on hover */
    color: white; /*will change color of text within the element on hover */
  }

  html {
    font-size: 62.5%; /*1rem = 10px*/
    box-sizing: border-box;      
  }  

  body {
    font-size: 1.4rem;
    font-family: sans-serif;
  }
`;

const StyledConnectButton = styled(ConnectButton)`
	width: 160px;
	height: 40px;
	background-color: #00000000 !important;
	box-shadow: 0px 2px 2px #d48e02;
	border: 1px solid #D48E0287 !important;
	border-radius: 4px !important;
	margin-top: 10px;
	color: white !important;
	font-weight: 600;
	margin-right: 15px;
	margin-top: 20px;
	cursor: pointer;
	transition: 0.3s;
	&:hover {
		box-shadow: 0 0 15px rgba(255, 170, 0, 0.788);
	}
`;

export default Header;
