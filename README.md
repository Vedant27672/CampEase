# CampEase

A full-stack web application for discovering and sharing campgrounds. Users can view, create, edit, and review campgrounds with image uploads and user authentication.

## Live Demo

🚀 **View the live application:** [https://campease.onrender.com/](https://campease.onrender.com/)

## Features

- User authentication and authorization
- View all campgrounds with images
- Create new campgrounds with multiple images
- Edit and delete campgrounds (author only)
- Leave reviews and ratings for campgrounds
- Responsive design with Bootstrap
- Image storage with Cloudinary

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Frontend:** EJS templates, Bootstrap 5, CSS
- **Authentication:** Passport.js with local strategy
- **Image Storage:** Cloudinary
- **Validation:** Joi
- **Session Management:** Express-session

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd CampEase
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:

   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret
   ```

4. Start MongoDB locally or update the connection string in `app.js`.

5. Run the application:

   ```bash
   npm start
   ```

   Or for development with auto-restart:

   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`.

## Seeding the Database

To populate the database with sample data:

```bash
node seeds/index.js
```

This will create 50 sample campgrounds associated with a test user.

## Test User Credentials

For testing purposes, the seeded data includes a test user:

- **Username:** testuser
- **Email:** testuser@example.com
- **Password:** password

You can log in with these credentials to test editing and deleting campgrounds.

## Project Structure

```
CampEase/
├── controllers/          # Route handlers
├── models/              # Mongoose schemas
├── routes/              # Express routes
├── views/               # EJS templates
├── public/              # Static assets (CSS, JS, images)
├── seeds/               # Database seeding scripts
├── utils/               # Utility functions
├── middleware.js        # Custom middleware
├── schemas.js           # Joi validation schemas
├── app.js               # Main application file
└── package.json         # Dependencies and scripts
```

## API Endpoints

- `GET /` - Home page
- `GET /campgrounds` - List all campgrounds
- `GET /campgrounds/new` - New campground form
- `POST /campgrounds` - Create campground
- `GET /campgrounds/:id` - Show campground details
- `GET /campgrounds/:id/edit` - Edit campground form
- `PUT /campgrounds/:id` - Update campground
- `DELETE /campgrounds/:id` - Delete campground
- `POST /campgrounds/:id/reviews` - Create review
- `DELETE /campgrounds/:id/reviews/:reviewId` - Delete review
- `GET /register` - User registration
- `POST /register` - Register user
- `GET /login` - User login
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
