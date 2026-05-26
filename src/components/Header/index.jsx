import {useState, useEffect} from 'react'
import {Link, NavLink, useLocation, useSearchParams, useNavigate} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import './index.css'

function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const isSearchRoute = location.pathname === '/search'
  const currentSearch = searchParams.get('search') || ''
  const [searchInput, setSearchInput] = useState(currentSearch)

  useEffect(() => {
    setSearchInput(currentSearch)
  }, [currentSearch])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim() !== '') {
      setSearchParams({search: searchInput})
    } else {
      setSearchParams({})
    }
  }

  const handleSearchIconClick = () => {
    if (!isSearchRoute) {
      navigate('/search')
    }
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <nav className={`header ${scrolled ? 'header-dark' : ''}`}>
      <div className="header-left">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660029314/movies%20prime%20app/Logo_l75pcc.png"
            alt="website logo"
            className="header-logo"
          />
        </Link>
        <ul className="header-nav-links desktop-only">
          <li>
            <NavLink
              to="/"
              className={({isActive}) =>
                isActive ? 'nav-link active-link' : 'nav-link'
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/popular"
              className={({isActive}) =>
                isActive ? 'nav-link active-link' : 'nav-link'
              }
            >
              Popular
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="header-right">
        {isSearchRoute ? (
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Search movies..."
              className="search-input"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <button type="submit" className="search-button" data-testid="searchButton">
              <FaSearch size={16} />
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="icon-btn"
            onClick={handleSearchIconClick}
            data-testid="searchButton"
            aria-label="search"
          >
            <FaSearch size={18} />
          </button>
        )}

        <Link to="/account">
          <img
            src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660029304/movies%20prime%20app/Profile_Avatar_mdfx2s.png"
            alt="profile"
            className="profile-img"
          />
        </Link>

        <button
          type="button"
          className="hamburger mobile-only"
          onClick={toggleMobileMenu}
          aria-label="menu"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>

      {showMobileMenu && (
        <div className="mobile-menu mobile-only">
          <ul className="mobile-nav-links">
            <li>
              <Link to="/" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/popular" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                Popular
              </Link>
            </li>
            <li>
              <Link to="/account" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                Account
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="close-btn"
            onClick={() => setShowMobileMenu(false)}
          >
            &times;
          </button>
        </div>
      )}
    </nav>
  )
}

export default Header
