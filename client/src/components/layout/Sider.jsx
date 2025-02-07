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
				>
					Home
				</MenuItem>
				{Number(authAddress) === Number(window.localStorage.getItem('userAddress')) ||
					Number(authAddress1) === Number(window.localStorage.getItem('userAddress')) ? (
					<MenuItem 
						icon={<FaCogs />} 
						component="div"
						onClick={() => navigate('/authSetting')}
					>
						Setting...
					</MenuItem>
				) : (
					''
				)}

				<SubMenu label="SaFuTranzPads" icon={<FaCentos />}>
					<MenuItem 
						component="div"
						onClick={() => navigate('/CreateToken')}
					>
						Create Token
					</MenuItem>
					<MenuItem 
						component="div"
						onClick={() => navigate('/LaunchPad1')}
					>
						Create LaunchPad
					</MenuItem>

					<MenuItem 
						component="div"
						onClick={() => navigate('/FairLaunch1')}
					>
						Create Fair Launch
					</MenuItem>
					<MenuItem size="xs" onClick={() => handleOpen('xs')}>
						Private Sale
					</MenuItem>

					<MenuItem 
						component="div"
						onClick={() => navigate('/PadList')}
					>
						Launchpad List
					</MenuItem>

					<MenuItem size="xs" onClick={() => handleOpen('xs')}>
						alarm
					</MenuItem>
				</SubMenu>
				<SubMenu label="Staking" icon={<FaStrikethrough />}>
					<MenuItem onClick={() => handleOpen('xs')}>$STZ Staking</MenuItem>
					<MenuItem 
						component="div"
						onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/contact-us', '_blank')}
					>
						Request Staking
					</MenuItem>
				</SubMenu>
				<MenuItem icon={<FaLock />} size="xs" onClick={() => handleOpen('xs')} 	style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}>
					Locks
				</MenuItem>

				<MenuItem 
					icon={<FaStudiovinari />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/referral-earning', '_blank')}
					style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}
				>
					Referral Earning
				</MenuItem>
				<MenuItem 
					icon={<FaAirbnb />}
					component="div"
					onClick={() => window.open('https://multisender.safutranz.com', '_blank')}
					style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}
				>
					AirDrop
				</MenuItem>
				<MenuItem 
					icon={<FaMoneyBillAlt />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/premium-sales', '_blank')}
					style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}
				>
					Premium Sales
				</MenuItem>
				<MenuItem icon={<FaSchlix />} size="xs" onClick={() => handleOpen('xs')} 	style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}>
					Multi-Sig
				</MenuItem>
				<MenuItem 
					icon={<FaStroopwafel />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/hire-developers', '_blank')}
					style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}
				>
					Hire Dev
				</MenuItem>
				<MenuItem 
					icon={<FaMastodon />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/hire-marketer', '_blank')}
					style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}
				>
					Hire Marketer
				</MenuItem>
				<MenuItem 
					icon={<FaDonate />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs', '_blank')}
					style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}
				>
					Docs
				</MenuItem>
				<MenuItem 
					icon={<FaLink />}
					component="div"
					onClick={() => window.open('https://linktree.com/safu_trendz', '_blank')}
					style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}
				>
					Social Links
				</MenuItem>
				<MenuItem 
					icon={<FaDAndD />} 
					size="xs"
					component="div"
					onClick={() => window.open('https://safutranz.gitbook.io/safutranz-docs/custom-dapp', '_blank')}
					style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}
				>
					Custom Dapp
				</MenuItem>
				<MenuItem icon={<FaAudible />} size="xs" onClick={() => handleOpen('xs')}	style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}>
					Dev Support
				</MenuItem>
				<MenuItem icon={<FaDiceD20 />} size="xs" onClick={() => handleOpen('xs')}	style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}>
					Online Help
				</MenuItem>
				<MenuItem icon={<FaDna />} size="xs" onClick={() => handleOpen('xs')}	style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}>
					Advertisement
				</MenuItem>
				<MenuItem
					icon={
						<img src={Logo} className="photo" alt="logo" style={{ width: '35px', height: '35px' }} />
					}
					component="div"
					onClick={() => window.open('https://safutranz.com/', '_blank')}
					style={{ color: '#ffaa00', backgroundColor: '#1f2126', '&:hover': { backgroundColor: '#ffaa00', color: '#1f2126' } }}
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


// Enhanced functionality added in update
const enhancedFeatures = {
    analytics: {
        trackEvent: (eventName, properties = {}) => {
            console.log(`Tracking event: ${eventName}`, properties);
        },
        
        trackPageView: (pageName) => {
            console.log(`Page view: ${pageName}`);
        },
        
        trackUserAction: (action, category = 'user') => {
            console.log(`User action: ${action} in category: ${category}`);
        }
    },
    
    performance: {
        measureExecutionTime: (fn, name = 'operation') => {
            return async (...args) => {
                const start = performance.now();
                const result = await fn(...args);
                const end = performance.now();
                console.log(`${name} took ${end - start} milliseconds`);
                return result;
            };
        },
        
        debounce: (func, wait, immediate = false) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        },
        
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    },
    
    security: {
        sanitizeInput: (input) => {
            if (typeof input !== 'string') return input;
            return input
                .replace(/[<>]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '')
                .trim();
        },
        
        validateEmail: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        generateSecureToken: (length = 32) => {
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return result;
        }
    },
    
    storage: {
        setItem: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                return false;
            }
        },
        
        getItem: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return defaultValue;
            }
        },
        
        removeItem: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        }
    },
    
    api: {
        createHttpClient: (baseURL, defaultHeaders = {}) => {
            return {
                get: async (url, options = {}) => {
                    const response = await fetch(`${baseURL}${url}`, {
                        method: 'GET',
                        headers: { ...defaultHeaders, ...options.headers },
                        ...options
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response.json();
                },
                
                post: async (url, data, options = {}) => {
                    const response = await fetch(`${baseURL}${url}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...defaultHeaders,
                            ...options.headers
                        },
                        body: JSON.stringify(data),
                        ...options
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response.json();
                },
                
                put: async (url, data, options = {}) => {
                    const response = await fetch(`${baseURL}${url}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...defaultHeaders,
                            ...options.headers
                        },
                        body: JSON.stringify(data),
                        ...options
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response.json();
                },
                
                delete: async (url, options = {}) => {
                    const response = await fetch(`${baseURL}${url}`, {
                        method: 'DELETE',
                        headers: { ...defaultHeaders, ...options.headers },
                        ...options
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response.json();
                }
            };
        },
        
        handleApiError: (error) => {
            console.error('API Error:', error);
            
            if (error.response) {
                return {
                    message: error.response.data?.message || 'Server error',
                    status: error.response.status,
                    data: error.response.data
                };
            } else if (error.request) {
                return {
                    message: 'Network error - please check your connection',
                    status: 0,
                    data: null
                };
            } else {
                return {
                    message: error.message || 'An unexpected error occurred',
                    status: -1,
                    data: null
                };
            }
        }
    }
};

// Export enhanced features
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ...module.exports, enhancedFeatures };
} else if (typeof window !== 'undefined') {
    window.enhancedFeatures = enhancedFeatures;
}
