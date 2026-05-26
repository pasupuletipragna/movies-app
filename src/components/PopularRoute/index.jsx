import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import {Link} from 'react-router-dom'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

function PopularRoute() {
  const [popularMovies, setPopularMovies] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const getPopularMovies = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const formattedData = data.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
        }))
        setPopularMovies(formattedData)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getPopularMovies()
  }, [])

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <div className="loader" />
    </div>
  )

  const renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660029314/movies%20prime%20app/Failure_View_ltedw0.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Something went wrong. Please try again</h1>
      <p className="failure-desc">We are having some trouble processing your request.</p>
      <button type="button" className="try-again-btn" onClick={getPopularMovies}>
        Try Again
      </button>
    </div>
  )

  const renderSuccessView = () => (
    <div className="popular-content">
      <h1 className="popular-heading">Popular</h1>
      <div className="popular-grid">
        {popularMovies.map(movie => (
          <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
            className="movie-grid-card-link"
          >
            <div className="movie-grid-card">
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="movie-grid-card-img"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  const renderPopularContent = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return (
    <div className="popular-page">
      <Header />
      <div className="popular-main-content">{renderPopularContent()}</div>
      <Footer />
    </div>
  )
}

export default PopularRoute
