import {Link} from 'react-router-dom'
import './index.css'

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <h1 className="not-found-heading">Lost Your Way?</h1>
        <p className="not-found-desc">
          we are sorry, the page you requested could not be found. Please go back to
          the homepage.
        </p>
        <Link to="/">
          <button type="button" className="not-found-home-btn">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
