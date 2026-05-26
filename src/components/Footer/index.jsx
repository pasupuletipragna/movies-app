import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <button type="button" className="footer-icon-btn">
          <FaGoogle size={24} />
        </button>
        <button type="button" className="footer-icon-btn">
          <FaTwitter size={24} />
        </button>
        <button type="button" className="footer-icon-btn">
          <FaInstagram size={24} />
        </button>
        <button type="button" className="footer-icon-btn">
          <FaYoutube size={24} />
        </button>
      </div>
      <p className="footer-text">Contact us</p>
    </footer>
  )
}

export default Footer
