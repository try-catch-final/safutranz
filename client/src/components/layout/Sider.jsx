import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Link, useNavigate } from 'react-router-dom';
import {
	FaHome,
	FaCentos,
	FaLock,
	FaAirbnb,
	FaSchlix,
	FaDAndD,
	FaMastodon,
	FaDonate,
	FaLink,
	FaMoneyBillAlt,
	FaAudible,
	FaStrikethrough,
	FaStroopwafel,
	FaStudiovinari,
	FaCogs,
	FaDiceD20,
	FaDna
} from 'react-icons/fa';
import Logo from '../assets/img/logo.png';
import { Modal, Button } from 'rsuite';

const authAddress = '0xf282003da9c996c1c3f783afe33e296b8f742ec7';
const authAddress1 = '0x9CfC9B378B9CA8D835cC6BD85655BFa6BE252419';

var wid = '',
	colWid = '',
	scrnState = { position: 'fixed' };

function Sider({ screen, togglettt }) {
	const navigate = useNavigate();
	const [menuCollapse, setMenuCollapse] = useState(false);
	const [open, setOpen] = React.useState(false);
	const [size, setSize] = React.useState();

	const handleOpen = (value) => {
		setSize(value);
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	const menuIconClick = () => {
		//condition checking to change state from true to false and vice versa
		menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
	};

	const mobile = { position: 'fixed', top: '60px' };
	const desktop = { position: 'fixed', top: '80px' };
	const mobileWidth = '250px';
	const desktopWidth = '350px';
	const mobileColwid = '70px';
	const desktopColwid = '80px';

	if (togglettt) {
		if (screen) {
			scrnState = mobile;
			wid = mobileWidth;
			colWid = mobileColwid;
		} else {
			scrnState = desktop;
			wid = desktopWidth;
			colWid = desktopColwid;
		}
	} else {
		if (screen) {
			scrnState = mobile;
		} else {
			scrnState = desktop;
		}
		wid = '0px';
		colWid = '0px';
	}

	return (
		<Sidebar
			collapsed={menuCollapse}
			style={scrnState}
			width={wid}
			collapsedWidth={colWid}
			className="sider-bar"
		>
			<Modal size={size} open={open} onClose={handleClose}>
				<Modal.Header />
				<Modal.Body>
					<h1>Coming Soon!</h1>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={handleClose} appearance="primary">
						Ok
					</Button>
				</Modal.Footer>
			</Modal>
			<Menu iconShape="circle">
				<MenuItem 
					icon={<FaHome />} 
					component="div"
					onClick={() => navigate('/')}
					style={{ color: '#ffaa00' }}
				>
					Home
				</MenuItem>
				{Number(authAddress) === Number(window.localStorage.getItem('userAddress')) ||
					Number(authAddress1) === Number(window.localStorage.getItem('userAddress')) ? (
					<MenuItem 
						icon={<FaCogs />} 
						component="div"
						onClick={() => navigate('/authSetting')}
						style={{ color: '#ffaa00' }}
					>
						Setting...
					</MenuItem>
				) : (
					''
				)}

				<SubMenu title="SaFuTranzPads " icon={<FaCentos />}>
					<MenuItem 
						component="div"
						onClick={() => navigate('/CreateToken')}
						style={{ color: '#ffaa00' }}
					>
						Create Token
					</MenuItem>
					<MenuItem 
						component="div"
						onClick={() => navigate('/LaunchPad1')}
						style={{ color: '#ffaa00' }}
					>
						Create LaunchPad
					</MenuItem>

					<MenuItem 
						component="div"
						onClick={() => navigate('/FairLaunch1')}
						style={{ color: '#ffaa00' }}
					>
						Create Fair Launch
					</MenuItem>
					<MenuItem size="xs" onClick={() => handleOpen('xs')}>
						Private Sale
					</MenuItem>

					<MenuItem 
						component="div"
						onClick={() => navigate('/PadList')}
						style={{ color: '#ffaa00' }}
					>
						Launchpad List
					</MenuItem>

					<MenuItem size="xs" onClick={() => handleOpen('xs')}>
						alarm
					</MenuItem>
				</SubMenu>
				<SubMenu title="Staking " icon={<FaStrikethrough />}>
					<MenuItem onClick={() => handleOpen('xs')}>$STZ Staking </MenuItem>
					<MenuItem 
						component="div"
						onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/safutranz-docs/contact-us', '_blank')}
						style={{ color: '#ffaa00' }}
					>
						Request Staking
					</MenuItem>
				</SubMenu>
				<MenuItem icon={<FaLock />} size="xs" onClick={() => handleOpen('xs')}>
					Locks
				</MenuItem>

				<MenuItem 
					icon={<FaStudiovinari />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/referral-earning', '_blank')}
					style={{ color: '#ffaa00' }}
				>
					Referral Earning
				</MenuItem>
				<MenuItem 
					icon={<FaAirbnb />}
					component="div"
					onClick={() => window.open('https://multisender.safutranz.com', '_blank')}
					style={{ color: '#ffaa00' }}
				>
					AirDrop
				</MenuItem>
				<MenuItem 
					icon={<FaMoneyBillAlt />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/premium-sales', '_blank')}
					style={{ color: '#ffaa00' }}
				>
					Premium Sales
				</MenuItem>
				<MenuItem icon={<FaSchlix />} size="xs" onClick={() => handleOpen('xs')}>
					Multi-Sig
				</MenuItem>
				<MenuItem 
					icon={<FaStroopwafel />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/hire-developers', '_blank')}
					style={{ color: '#ffaa00' }}
				>
					Hire Dev
				</MenuItem>
				<MenuItem 
					icon={<FaMastodon />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/hire-marketer', '_blank')}
					style={{ color: '#ffaa00' }}
				>
					Hire Marketer
				</MenuItem>
				<MenuItem 
					icon={<FaDonate />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs', '_blank')}
					style={{ color: '#ffaa00' }}
				>
					Docs
				</MenuItem>
				<MenuItem 
					icon={<FaLink />}
					component="div"
					onClick={() => window.open('https://linktree.com/safu_trendz', '_blank')}
					style={{ color: '#ffaa00' }}
				>
					Social Links
				</MenuItem>
				<MenuItem 
					icon={<FaDAndD />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/custom-dapp', '_blank')}
					style={{ color: '#ffaa00' }}
				>
					Custom Dapp
				</MenuItem>
				<MenuItem icon={<FaAudible />} size="xs" onClick={() => handleOpen('xs')}>
					Dev Support
				</MenuItem>
				<MenuItem icon={<FaDiceD20 />} size="xs" onClick={() => handleOpen('xs')}>
					Online Help
				</MenuItem>
				<MenuItem icon={<FaDna />} size="xs" onClick={() => handleOpen('xs')}>
					Advertisement
				</MenuItem>
				<MenuItem
					icon={
						<img src={Logo} className="photo" alt="logo" style={{ width: '35px', height: '35px' }} />
					}
					component="div"
					onClick={() => window.open('https://safutranz.com/', '_blank')}
					style={{ color: '#ffaa00' }}
				>
					SafuTranz
				</MenuItem>
				<MenuItem onClick={menuIconClick}>
					{!menuCollapse ? (
						<ChevronLeft size={30} className="flux-right" />
					) : (
						<ChevronRight size={30} className="flux-right" />
					)}
				</MenuItem>
				<br />
				<hr />
			</Menu>
		</Sidebar>
	);
}

export default Sider;
