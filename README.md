# SafuTranz - Blockchain Wallet Authentication System

A modern React + Node.js application with comprehensive blockchain wallet authentication support, built with Vite for fast development and optimized performance.

## 🚀 Features

### Blockchain Wallet Authentication
- **Multi-Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet
- **Secure Signature Verification**: Nonce-based authentication with cryptographic signatures
- **JWT Token Management**: Secure session management with JSON Web Tokens
- **Network Detection**: Automatic chain ID detection and network switching
- **Real-time Connection Status**: Live wallet connection monitoring

### Frontend (React + Vite)
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **TypeScript Support**: Full TypeScript implementation for better development experience
- **Web3 Integration**: Comprehensive Web3 context and hooks
- **Redux State Management**: Centralized state management for wallet and auth
- **Real-time Updates**: Live wallet status and network changes

### Backend (Node.js + Express)
- **RESTful API**: Clean, well-documented API endpoints
- **MongoDB Integration**: Scalable database with Mongoose ODM
- **JWT Authentication**: Secure token-based authentication
- **Signature Verification**: Cryptographic signature validation using ethers.js
- **Error Handling**: Comprehensive error handling and validation

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **Web3.js** - Ethereum blockchain interaction
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **ethers.js** - Ethereum library for signature verification
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 21.x or higher
- MongoDB instance
- MetaMask or other Web3 wallet

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SafuTranz-main
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the application**
   ```bash
   # Development mode (both client and server)
   npm run dev
   
   # Or start separately
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 4000
   ```

## 🔐 Wallet Authentication Flow

### 1. Wallet Connection
```typescript
// User clicks "Connect Wallet" button
const handleConnect = async () => {
  await web3Connect();
  if (account) {
    connectWallet({
      walletAddress: account,
      chainId: chainId || '1',
      walletType: 'MetaMask'
    });
  }
};
```

### 2. User Registration/Verification
```typescript
// Backend checks if user exists
const user = await User.findOne({ walletAddress: address.toLowerCase() });

if (!user) {
  // Create new user with nonce
  const newUser = new User({
    walletAddress: address.toLowerCase(),
    walletType: 'MetaMask',
    nonce: Math.floor(Math.random() * 1000000).toString()
  });
}
```

### 3. Signature Verification
```typescript
// Frontend requests signature
const message = `Login to SafuTranz\n\nNonce: ${nonce}\nWallet: ${walletAddress}`;
const signature = await window.ethereum.request({
  method: 'personal_sign',
  params: [message, walletAddress]
});

// Backend verifies signature
const recoveredAddress = ethers.verifyMessage(message, signature);
if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
  // Generate JWT token
  const token = jwt.sign(payload, secret, { expiresIn: '24h' });
}
```

## 📁 Project Structure

```
SafuTranz-main/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx        # Traditional login
│   │   │   │   ├── WalletLogin.tsx  # Wallet authentication
│   │   │   │   └── AuthSetting.jsx  # User settings
│   │   │   ├── common/
│   │   │   │   └── WalletConnect.tsx # Wallet connection component
│   │   │   └── ...                  # Other components
│   │   ├── contexts/
│   │   │   └── Web3Context.tsx      # Web3 context provider
│   │   ├── actions/
│   │   │   ├── authActions.js       # Traditional auth actions
│   │   │   └── walletAuthActions.js # Wallet auth actions
│   │   ├── reducers/
│   │   │   └── index.js             # Redux reducers
│   │   └── App.tsx                  # Main app component
│   ├── vite.config.ts               # Vite configuration
│   └── package.json
├── server/                          # Node.js backend
│   ├── routes/
│   │   ├── auth.js                  # Traditional auth routes
│   │   └── walletAuth.js            # Wallet auth routes
│   ├── models/
│   │   └── Auth.js                  # User model with wallet fields
│   ├── config/
│   │   ├── keys.js                  # Configuration
│   │   └── passport.js              # Passport configuration
│   └── server.js                    # Main server file
└── package.json
```

## 🔌 API Endpoints

### Wallet Authentication
- `GET /api/auth/wallet/:address` - Check if wallet user exists
- `POST /api/auth/wallet/register` - Register new wallet user
- `GET /api/auth/wallet/nonce/:address` - Get nonce for signature
- `POST /api/auth/wallet/verify` - Verify signature and authenticate
- `GET /api/auth/wallet/profile` - Get user profile (protected)
- `PUT /api/auth/wallet/profile` - Update user profile (protected)

### Traditional Authentication
- `POST /api/auth/login` - Traditional password login
- `POST /api/auth/register` - Traditional user registration

## 🎨 UI Components

### WalletLogin Component
- Multi-wallet support (MetaMask, WalletConnect, Coinbase)
- Real-time connection status
- Error handling and user feedback
- Responsive design with beautiful animations

### WalletConnect Component
- Header wallet connection button
- Dropdown with wallet information
- Network switching capabilities
- Disconnect functionality

## 🔧 Configuration

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

### Web3 Context
```typescript
// Web3Context.tsx
const Web3Provider: React.FC = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  
  // Wallet connection logic
  // Event listeners for account/chain changes
  // Network switching functionality
};
```

## 🚀 Deployment

### Production Build
```bash
# Build the client
cd client
npm run build

# Start production server
npm start
```

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
```

## 🔒 Security Features

- **Nonce-based Authentication**: Prevents replay attacks
- **Cryptographic Signature Verification**: Ensures wallet ownership
- **JWT Token Expiration**: Automatic session management
- **Input Validation**: Comprehensive validation on all endpoints
- **Error Handling**: Secure error responses without sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- [ ] WalletConnect v2 integration
- [ ] Multi-chain support (Polygon, BSC, etc.)
- [ ] Social login integration
- [ ] Two-factor authentication
- [ ] Advanced wallet analytics
- [ ] Mobile app support

---

**Built with ❤️ using React, Node.js, and Web3 technologies** 