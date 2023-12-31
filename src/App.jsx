import Register from './pages/Register';
import Login from './pages/login';
import Home from './pages/Home';
import './style.scss'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { useAuth } from './hooks/useAuth'

function App() {
  const {currentUser} = useAuth();

  const ProtectedRoute = ({ children }) => {
    if(!currentUser) {
      return <Navigate to='/login' />;
    }
    return children;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<ProtectedRoute>
              <Home />
          </ProtectedRoute>} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
