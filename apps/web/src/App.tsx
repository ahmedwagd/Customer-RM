import { Routes, Route } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import ContactsPage from './pages/contacts'
import NewContact from './pages/contacts/NewContact'
import ContactDetail from './pages/contacts/ContactDetail'
import EditContact from './pages/contacts/EditContact'
import CompaniesPage from './pages/companies'
import NewCompany from './pages/companies/NewCompany'
import CompanyDetail from './pages/companies/CompanyDetail'
import DealsPage from './pages/deals'
import NewDeal from './pages/deals/NewDeal'
import DealDetail from './pages/deals/DealDetail'
import TasksPage from './pages/tasks'
import NotesPage from './pages/notes'
import ActivitiesPage from './pages/activities'
import TagsPage from './pages/tags'
import UsersPage from './pages/users'
import ProfilePage from './pages/profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/new" element={<NewContact />} />
          <Route path="/contacts/:id" element={<ContactDetail />} />
          <Route path="/contacts/:id/edit" element={<EditContact />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/new" element={<NewCompany />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/deals/new" element={<NewDeal />} />
          <Route path="/deals/:id" element={<DealDetail />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  )
}
