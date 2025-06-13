# FlatBuddies Client

A modern web application for finding roommates and flats using a Tinder-like interface.

## Features

- 🔐 Secure authentication with email and Google
- 🏠 Multiple user flows:
  - Looking for a flat
  - Looking for a roommate
  - Posting for replacement
- 💫 Tinder-like swiping interface
- 🎯 Smart matching algorithm based on:
  - Budget
  - Location
  - Lifestyle preferences
  - Gender preference
- 📱 Responsive design
- 💬 Real-time chat system
- 📊 User profiles with detailed preferences

## Tech Stack

- React (Vite)
- Material-UI
- Firebase Authentication
- React Tinder Card
- React Router
- Axios
- Framer Motion

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable components
├── contexts/       # React contexts
├── pages/         # Page components
├── services/      # API services
├── utils/         # Utility functions
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
