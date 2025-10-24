# CineFlix - Multi-Language Movie Streaming Platform

A comprehensive movie streaming and downloading platform supporting multiple languages including English, Ateso, Lusoga, Lumasaba, and Luganda.

## Features

### Core Features
- **Multi-language Support**: Movies available in English, Ateso, Lusoga, Lumasaba, and Luganda
- **Streaming & Downloads**: Stream movies online or download for offline viewing
- **Subscription Tiers**: Free, Basic, and Premium plans with different access levels
- **User Authentication**: Secure registration and login system
- **Payment Integration**: Flutterwave-powered subscription management

### User Features
- Browse movies by language and genre
- Search functionality
- User profiles with preferred language settings
- Download tracking and management
- Responsive design for all devices

### Admin Features
- Movie upload with multi-language support
- Subscription management
- User analytics
- Content moderation

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Flutterwave** for payments
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Frontend
- **React** with React Router
- **Axios** for API calls
- **Flutterwave** for payments
- **React Player** for video streaming
- **CSS3** for styling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Flutterwave account for payments

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   copy .env.example .env
   ```

4. Configure environment variables in `.env`:
   - MongoDB connection string
   - JWT secret key
   - Flutterwave API keys

5. Create uploads directory:
   ```bash
   mkdir uploads
   mkdir uploads\movies
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   copy .env.example .env
   ```

4. Configure environment variables in `.env`:
   - API URL (backend server)
   - Flutterwave public key

5. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Movies
- `GET /api/movies` - Get all movies (with filters)
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/:id/stream/:language` - Stream movie
- `POST /api/movies/:id/download/:language` - Download movie
- `POST /api/movies/upload` - Upload movie (admin)

### Subscriptions
- `GET /api/subscriptions/plans` - Get subscription plans
- `POST /api/subscriptions/create` - Create subscription
- `POST /api/subscriptions/cancel` - Cancel subscription

## Subscription Plans

### Free Plan
- Limited movie access
- Standard quality (720p)
- Single language support
- No downloads

### Basic Plan ($9.99/month)
- Extended movie library
- HD quality (1080p)
- All language support
- Up to 5 downloads

### Premium Plan ($19.99/month)
- Full movie library
- 4K quality support
- All language support
- Unlimited downloads
- Early access to new releases

## Language Support

The platform currently supports:
- **English** - Primary language
- **Ateso** - Ugandan language
- **Lusoga** - Ugandan language
- **Lumasaba** - Ugandan language
- **Luganda** - Ugandan language

Additional languages can be easily added by:
1. Updating the language enum in the User and Movie models
2. Adding language options to the frontend components
3. Uploading translated content

## File Structure

```
cineflix/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   ├── public/
│   └── package.json
└── README.md
```

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or cloud database
2. Configure environment variables for production
3. Deploy to services like Heroku, AWS, or DigitalOcean
4. Set up file storage (AWS S3, Cloudinary)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to services like Netlify, Vercel, or AWS S3
3. Configure environment variables for production

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file upload handling
- CORS configuration

## Future Enhancements

- Mobile app development
- Offline viewing capabilities
- Social features (reviews, ratings)
- Recommendation engine
- Live streaming support
- Multi-device synchronization
- Advanced analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.