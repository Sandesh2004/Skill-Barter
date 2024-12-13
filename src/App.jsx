import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Lazy-loaded components
const Welcome = lazy(() => import('./components/Welcome/Welcome.jsx'));
const Login = lazy(() => import('./components/Login/Login.jsx'));
const Signup = lazy(() => import('./components/Signup/Signup.jsx'));
const Home = lazy(() => import('./components/Home/Home.jsx'));
const Exchange = lazy(() => import('./components/Exchange/Exchange.jsx'));
const Notifications = lazy(() => import('./components/Notifications/Notifications.jsx'));
const Profile = lazy(() => import('./components/Profile/Profile.jsx'));
const SearchCourse = lazy(() => import('./components/SearchCourse/SearchCourse.jsx'));
const ProfileView = lazy(() => import('./components/Profile/ProfileView.jsx'));
const AboutUs = lazy(() => import('./components/About/About.jsx'));
const Verify = lazy(() => import('./components/Verify/Verify.jsx')); // Import Verify component


const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Common routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Home routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/home/exchange" element={<Exchange />} />
          <Route path="/home/notifications" element={<Notifications />} />
          <Route path="/home/profile" element={<Profile />} />
          <Route path="/home/about" element={<AboutUs />} />

          {/* New routes */}
          <Route path="/search-course" element={<SearchCourse />} />
          <Route path="/profile/:userId" element={<ProfileView />} />

          <Route path="verify/:course" element={<Verify />} />



          {/* Fallback for unknown routes */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
