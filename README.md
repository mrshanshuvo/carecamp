# CareCamp

A modern React frontend for a medical camp management platform that connects participants and organizers through camp discovery, registration, payments, dashboards, analytics, and feedback.

## Features

* Browse available medical camps
* View detailed camp information
* Register for medical camps
* Secure authentication with Firebase
* Email/password and Google authentication
* Role-based access control
* Participant dashboard
* Organizer dashboard
* Camp management for organizers
* Camp registration management
* Stripe payment integration
* Payment history
* Participant analytics
* Organizer analytics
* Feedback and ratings
* Search, sorting, and pagination
* Responsive design
* Loading states and skeletons
* Toast and alert notifications
* SEO-friendly page metadata
* Protected routes
* Error boundary handling

## User Roles

### Participant

Participants can:

* Browse medical camps
* View camp details
* Register for camps
* Complete payments
* View registered camps
* View payment history
* Track participation analytics
* Submit feedback and ratings
* Manage their profile

### Organizer

Organizers can:

* Manage their profile
* Add medical camps
* Update and manage camps
* View registered participants
* Manage registrations
* View organizer analytics

## Main Sections

The application includes:

* Home
* Available Camps
* Camp Details
* Success Stories
* About
* Blog
* FAQs
* Documentation
* Contact
* Feedback
* Privacy Policy
* Terms & Conditions
* Authentication
* Participant Dashboard
* Organizer Dashboard

## Tech Stack

### Frontend

* React 19
* Vite
* JavaScript
* React Router
* Tailwind CSS
* Material UI
* Radix UI
* TanStack React Query
* React Hook Form
* Axios
* Recharts
* React Helmet Async

### Authentication

* Firebase Authentication
* Email and Password Authentication
* Google Authentication

### Payments

* Stripe
* Stripe React
* Stripe.js

### UI & Utilities

* Lucide React
* Heroicons
* React Icons
* React Hot Toast
* SweetAlert2
* React Loading Skeleton
* date-fns

### Development Tools

* ESLint
* Prettier
* Husky
* lint-staged

## Application Flow

```text
                    CareCamp
                       │
          ┌────────────┴────────────┐
          │                         │
      Participant                Organizer
          │                         │
   Browse Camps              Manage Camps
          │                         │
   View Camp Details          Manage Registrations
          │                         │
     Register                   Analytics
          │
       Payment
          │
   Track Participation
          │
   Feedback & Rating
```

## Project Structure

```text
carecamp/
├── public/
│   ├── care-camp.png
│   ├── manifest.json
│   └── ...
├── src/
│   ├── assets/
│   ├── components/
│   ├── contexts/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── hooks/
│   ├── providers/
│   └── main.jsx
├── .firebaserc
├── .gitignore
├── .husky/
├── components.json
├── eslint.config.js
├── firebase.json
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

### Clone the Repository

```bash
git clone https://github.com/mrshanshuvo/carecamp.git
cd carecamp
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file and configure the required environment variables for:

* Firebase
* Backend API
* Stripe

Do not commit sensitive credentials to the repository.

### Run the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Checks the project for ESLint issues.

```bash
npm run lint:fix
```

Automatically fixes applicable ESLint issues.

```bash
npm run format
```

Formats the project using Prettier.

```bash
npm run format:check
```

Checks Prettier formatting.

## Authentication

CareCamp uses Firebase Authentication for user authentication.

Supported authentication methods include:

* Email and password
* Google authentication

Authentication state is managed through the application's authentication context.

Protected routes ensure that authenticated users can access the appropriate application areas.

## Role-Based Access

The application separates access based on user roles.

```text
Public
 ├── Home
 ├── Camps
 ├── About
 ├── Blog
 ├── FAQs
 └── Contact

Authenticated
 └── Dashboard

Organizer
 ├── Organizer Profile
 ├── Analytics
 ├── Add Camp
 ├── Manage Camps
 └── Manage Registrations

Participant
 ├── Profile
 ├── Analytics
 ├── Registered Camps
 └── Payment History
```

## Payment Integration

CareCamp integrates Stripe for online payments.

The payment flow allows participants to complete payments associated with their camp registrations and view their payment history.

## Data Management

TanStack React Query is used for server-state management and API data handling.

Axios is used for HTTP communication with the backend services.

## Responsive Design

CareCamp is designed to provide a consistent experience across:

* Desktop
* Tablet
* Mobile devices

The interface uses responsive layouts and reusable components to maintain usability across different screen sizes.

## Code Quality

The project uses:

* ESLint for code quality
* Prettier for formatting
* Husky for Git hooks
* lint-staged for staged-file checks

These tools help maintain consistent and maintainable code.

## Project Status

Active frontend project.

## License

This project is licensed under the MIT License.

## Author

**Shahid Hasan Shuvo**

Full Stack Developer
