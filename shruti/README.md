# Portfolio Builder Frontend

A modern React application for creating beautiful professional portfolios.

## Features

- 🎨 Modern UI with smooth animations
- 📱 Fully responsive design
- 🔐 Secure authentication with JWT
- 💼 Portfolio management
- 📊 Project showcase
- 🌙 Dark mode design
- ⚡ Fast and optimized

## Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Backend running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (not reversible!)
npm eject
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js
│   ├── Hero.js
│   └── ProjectCard.js
├── pages/              # Page components
│   ├── Home.js
│   ├── Login.js
│   ├── Signup.js
│   ├── Dashboard.js
│   ├── CreatePortfolio.js
│   ├── AddProject.js
│   └── Preview.js
├── services/           # API services
│   └── api.js
├── styles/             # Global styles
│   └── style.css
├── App.js              # Main app component
└── index.js            # Entry point
```

## Key Features

### Authentication
- Register new account
- Login securely
- JWT token management
- Protected routes

### Portfolio Management
- Create personal portfolio
- Add skills and experience
- Link social profiles
- Manage contact information

### Project Management
- Add multiple projects
- Edit project details
- Delete projects
- Upload project images
- Add demo and GitHub links

### Dashboard
- View portfolio statistics
- Quick actions
- Project management interface

## Components

### Navbar
- Navigation links
- User authentication links
- Logout functionality

### Hero
- Landing section
- Call-to-action button
- Responsive design

### ProjectCard
- Project information display
- Demo and GitHub links
- Project image

## Pages

### Home
- Landing page
- Feature showcase
- Call-to-action

### Login/Signup
- User authentication
- Form validation
- Error handling

### Dashboard
- User portfolio overview
- Project statistics
- Quick management tools

### CreatePortfolio
- Portfolio information form
- Validation
- Submit to backend

### AddProject
- Project form
- Link management

### Preview
- Portfolio preview
- Project showcase
- Public view

## API Integration

The app uses Axios for API calls with automatic JWT token handling.

Example API call:
```javascript
import { userAPI } from './services/api';

// Login
const response = await userAPI.login({ email, password });
```

## Styling

Modern CSS with:
- Gradient backgrounds
- Smooth animations
- Responsive grid layouts
- Dark theme
- Hover effects
- Transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Fast initial load
- Optimized components
- Lazy loading support
- CSS animations (GPU accelerated)

## Security

- JWT authentication
- Secure token storage
- Protected routes
- Password validation
- XSS prevention

## Troubleshooting

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### API Connection Issues
1. Ensure backend is running on port 5000
2. Check if MongoDB is connected
3. Verify API URL in `services/api.js`

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

## Dependencies

- react: ^19.2.6
- react-dom: ^19.2.6
- react-router-dom: ^7.15.1
- axios: ^1.4.0
- react-scripts: 5.0.1

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC

---

**Built with React & ❤️**

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
