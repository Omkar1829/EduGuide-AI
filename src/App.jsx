import { Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AITutor from './pages/AITutor'
import Courses from './pages/Courses'
import Vault from './pages/Vault'
import CourseDetail from './pages/CourseDetail'
import Lesson from './pages/Lesson'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import AdminShell from './admin/AdminShell'
import AdminRoute from './admin/AdminRoute'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminUsers from './admin/pages/AdminUsers'
import AdminDocuments from './admin/pages/AdminDocuments'
import AdminCourses from './admin/pages/AdminCourses'
import AdminJobs from './admin/pages/AdminJobs'
import AdminQuiz from './admin/pages/AdminQuiz'
import AdminAIConfig from './admin/pages/AdminAIConfig'
import AdminAnalytics from './admin/pages/AdminAnalytics'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tutor" element={<AITutor />} />
        <Route path="vault" element={<Vault />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<CourseDetail />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<Lesson />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminShell />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="quiz" element={<AdminQuiz />} />
        <Route path="ai-config" element={<AdminAIConfig />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
