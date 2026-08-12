import { createBrowserRouter } from 'react-router';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home/Home';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Authentication/Login/Login';
import Register from '../pages/Authentication/Register/Register';
import AvailableCamps from '../pages/Camps/AvailableCamps';
import CampDetails from '../pages/Camps/CampDetails';
import NotFound from '../pages/NotFound/NotFound';
import DashboardLayout from '../layouts/DashboardLayout';
import AddCamp from '../pages/Dashboard/Organizer/AddCamp';
import ManageCamps from '../pages/Dashboard/Organizer/ManageCamps';
import ManageRegistrations from '../pages/Dashboard/Organizer/ManageRegistrations';
import OrganizerRoute from './OrganizerRoute';
import PrivateRoute from './PrivateRoute';
import ParticipantRoute from './ParticipantRoute';
import DashboardRouter from './DashboardRouter';
import OrganizerAnalytics from '../pages/Dashboard/Organizer/OrganizerAnalytics';
import Analytics from '../pages/Dashboard/Participant/Analytics';
import ParticipantProfile from '../pages/Dashboard/Participant/ParticipantProfile';
import PaymentHistory from '../pages/Dashboard/Participant/PaymentHistory';
import OrganizerProfile from '../pages/Dashboard/Organizer/OrganizerProfile';
import SuccessStories from '../pages/SuccessStories/SuccessStories';
import AboutUs from '../pages/AboutUs/AboutUs';
import Blog from '../pages/Blog/Blog';
import FAQs from '../pages/FAQs/FAQs';
import Docs from '../pages/Docs/Docs';
import PPolicy from '../pages/PPolicy/PPolicy';
import TermsOfService from '../pages/TermsOfService/TermsOfService';
import ContactUs from '../pages/ContactUs/ContactUs';
import RegisteredCamps from '../pages/Dashboard/Participant/RegisteredCamps/RegisteredCamps';
import FeedbackPage from '../pages/FeedbackPage/FeedbackPage';
import PublicOnly from './PublicOnly';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'available-camps', element: <AvailableCamps /> },
      { path: 'success-stories', element: <SuccessStories /> },
      { path: 'about', element: <AboutUs /> },
      { path: 'blog', element: <Blog /> },
      { path: 'faqs', element: <FAQs /> },
      { path: 'docs', element: <Docs /> },
      { path: 'pPolicy', element: <PPolicy /> },
      { path: 'privacy', element: <PPolicy /> },
      { path: 'terms', element: <TermsOfService /> },
      { path: 'contact', element: <ContactUs /> },
      { path: 'camp-details/:campId', element: <CampDetails /> },
      { path: 'feedback', element: <FeedbackPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <PublicOnly>
        <AuthLayout />
      </PublicOnly>
    ),
    errorElement: <NotFound />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <DashboardRouter />,
      },
      {
        path: 'organizer-profile',
        element: (
          <OrganizerRoute>
            <OrganizerProfile />
          </OrganizerRoute>
        ),
      },
      {
        path: 'organizer-analytics',
        element: (
          <OrganizerRoute>
            <OrganizerAnalytics />
          </OrganizerRoute>
        ),
      },
      {
        path: 'add-camp',
        element: (
          <OrganizerRoute>
            <AddCamp />
          </OrganizerRoute>
        ),
      },
      {
        path: 'manage-camps',
        element: (
          <OrganizerRoute>
            <ManageCamps />
          </OrganizerRoute>
        ),
      },
      {
        path: 'manage-registrations',
        element: (
          <OrganizerRoute>
            <ManageRegistrations />
          </OrganizerRoute>
        ),
      },
      {
        path: 'manage-registered-camps',
        element: (
          <OrganizerRoute>
            <ManageRegistrations />
          </OrganizerRoute>
        ),
      },
      {
        path: 'analytics',
        element: (
          <ParticipantRoute>
            <Analytics />
          </ParticipantRoute>
        ),
      },
      {
        path: 'participant-profile',
        element: (
          <ParticipantRoute>
            <ParticipantProfile />
          </ParticipantRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ParticipantRoute>
            <ParticipantProfile />
          </ParticipantRoute>
        ),
      },
      {
        path: 'registered-camps',
        element: (
          <ParticipantRoute>
            <RegisteredCamps />
          </ParticipantRoute>
        ),
      },
      {
        path: 'payment-history',
        element: (
          <ParticipantRoute>
            <PaymentHistory />
          </ParticipantRoute>
        ),
      },
    ],
  },
]);
