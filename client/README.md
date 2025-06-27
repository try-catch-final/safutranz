# SafuTranz Client

This is the client-side application for SafuTranz, built with React 18 and Vite.

## Migration from Create React App

This project has been migrated from Create React App to Vite for better performance and faster development experience.

### Key Changes Made:

1. **Updated React to version 18** - Using the new `createRoot` API
2. **Migrated to Vite** - Replaced CRA with Vite for faster builds
3. **Updated React Router to v6** - Replaced `Switch` with `Routes` and updated routing syntax
4. **Updated Web3 to v4** - Updated imports and usage patterns
5. **Updated all dependencies** - All packages updated to latest compatible versions

### Updated Dependencies:

- React: 16.13.1 → 18.2.0
- React Router DOM: 5.2.0 → 6.20.1
- Web3: 1.7.3 → 4.3.0
- Redux: 4.2.0 → 5.0.1
- React Redux: 8.0.1 → 9.0.4
- And many more...

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
```

3. Build for production:
```bash
npm run build
# or
yarn build
```

4. Preview production build:
```bash
npm run preview
# or
yarn preview
```

## Development

The development server will start on `http://localhost:3000` and will proxy API requests to `http://localhost:5000` (the backend server).

## Build

The build output will be in the `dist` directory, which can be served by any static file server.

## Key Features

- React 18 with concurrent features
- Vite for fast development and builds
- React Router v6 for routing
- Redux for state management
- Web3 integration for blockchain functionality
- RSuite UI components
- Less CSS preprocessing
- Hot module replacement
- TypeScript support (optional)

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── common/         # Common/shared components
│   ├── dashboard/      # Dashboard components
│   ├── fairLaunch/     # Fair launch components
│   ├── layout/         # Layout components
│   ├── lunch/          # Launchpad components
│   ├── pad/            # Pad components
│   ├── staking/        # Staking components
│   └── token/          # Token components
├── actions/            # Redux actions
├── reducers/           # Redux reducers
├── utils/              # Utility functions
├── validation/         # Validation functions
├── App.js              # Main App component
├── main.jsx            # Entry point
└── store.js            # Redux store configuration
```

## Configuration

The Vite configuration is in `vite.config.js` and includes:

- React plugin
- Less CSS preprocessing
- Proxy configuration for API calls
- Path aliases
- Build optimization

## Troubleshooting

If you encounter any issues:

1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Clear Vite cache:
```bash
rm -rf node_modules/.vite
```

3. Check that all dependencies are properly installed and compatible.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 