import {useState} from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

function LoginRoute() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const token = Cookies.get('jwt_token')
  if (token !== undefined) {
    return <Navigate to="/" replace />
  }

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
    navigate('/', {replace: true})
  }

  const onSubmitFailure = errorMsg => {
    setShowSubmitError(true)
    setErrorMsg(errorMsg)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (username === '' || password === '') {
      onSubmitFailure('Please enter both username and password')
      return
    }

    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        onSubmitSuccess(data.jwt_token)
      } else {
        onSubmitFailure(data.error_msg || "username and password didn't match")
      }
    } catch {
      onSubmitFailure('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-overlay" />
      <div className="login-card">
        <img
          src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660029314/movies%20prime%20app/Logo_l75pcc.png"
          alt="login website logo"
          className="login-logo"
        />
        <h1 className="login-title">Sign in</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="login-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter Username"
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>
          {showSubmitError && <p className="error-msg">{errorMsg}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginRoute
