import Cookies from 'js-cookie'
import {useNavigate} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

function AccountRoute() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || ''
  const password = localStorage.getItem('password') || ''
  const maskedPassword = password.replace(/./g, '•')

  const handleLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login', {replace: true})
  }

  return (
    <div className="account-page">
      <Header />
      <div className="account-content">
        <h1 className="account-heading">Account</h1>
        <hr className="account-divider" />

        <div className="account-section">
          <p className="account-label">Member ship</p>
          <div className="account-info">
            <p className="account-username">{username}@gmail.com</p>
            <p className="account-password">{maskedPassword}</p>
          </div>
        </div>
        <hr className="account-divider" />

        <div className="account-section">
          <p className="account-label">Plan details</p>
          <div className="account-info plan-info">
            <p className="plan-name">Premium</p>
            <span className="plan-badge">Ultra HD</span>
          </div>
        </div>
        <hr className="account-divider" />

        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default AccountRoute
