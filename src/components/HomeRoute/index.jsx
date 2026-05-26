import {useState, useEffect, useRef} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import {Link} from 'react-router-dom'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

function HomeRoute() {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [originalsMovies, setOriginalsMovies] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [heroMovie, setHeroMovie] = useState(null)

  const trendingRef = useRef(null)
  const topRatedRef = useRef(null)
  const originalsRef = useRef(null)

  const getMoviesData = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const token = Cookies.get('jwt_token')
    
    const trendingUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
    const topRatedUrl = 'https://apis.ccbp.in/movies-app/top-rated-movies'
    const originalsUrl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    try {
      const [trendingResponse, topRatedResponse, originalsResponse] = await Promise.all([
        fetch(trendingUrl, options),
        fetch(topRatedUrl, options),
        fetch(originalsUrl, options),
      ])

      if (trendingResponse.ok && topRatedResponse.ok && originalsResponse.ok) {
        const trendingData = await trendingResponse.json()
        const topRatedData = await topRatedResponse.json()
        const originalsData = await originalsResponse.json()

        const formattedTrending = trendingData.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          overview: movie.overview,
        }))

        const formattedTopRated = topRatedData.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          overview: movie.overview,
        }))

        const formattedOriginals = originalsData.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          overview: movie.overview,
        }))

        setTrendingMovies(formattedTrending)
        setTopRatedMovies(formattedTopRated)
        setOriginalsMovies(formattedOriginals)
        
        // Select a random movie or the first movie from Originals for Hero Section
        if (formattedOriginals.length > 0) {
          const randomIndex = Math.floor(Math.random() * formattedOriginals.length)
          setHeroMovie(formattedOriginals[randomIndex])
        }

        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getMoviesData()
  }, [])

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      ref.current.scrollBy({left: scrollAmount, behavior: 'smooth'})
    }
  }

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
      <button type="button" className="try-again-btn" onClick={getMoviesData}>
        Try Again
      </button>
    </div>
  )

  const renderSuccessView = () => {
    return (
      <div className="home-container">
        {heroMovie && (
          <div
            className="hero-section"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.85) 100%), linear-gradient(to top, rgba(15,15,15,1) 0%, rgba(15,15,15,0) 25%), url(${heroMovie.backdropPath})`,
            }}
          >
            <div className="hero-content">
              <h1 className="hero-title">{heroMovie.title}</h1>
              <p className="hero-description">{heroMovie.overview}</p>
              <Link to={`/movies/${heroMovie.id}`}>
                <button type="button" className="play-btn">
                  Play
                </button>
              </Link>
            </div>
          </div>
        )}

        <div className="movies-sliders-container">
          <div className="slider-section">
            <h2 className="slider-heading">Trending Now</h2>
            <div className="slider-wrapper">
              <button
                type="button"
                className="scroll-btn left"
                onClick={() => scroll(trendingRef, 'left')}
                aria-label="scroll left"
              >
                <FaChevronLeft size={20} />
              </button>
              <div className="slider-items-container" ref={trendingRef}>
                {trendingMovies.map(movie => (
                  <Link
                    to={`/movies/${movie.id}`}
                    key={movie.id}
                    className="movie-card-link"
                  >
                    <div className="movie-card">
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="movie-card-img"
                      />
                    </div>
                  </Link>
                ))}
              </div>
              <button
                type="button"
                className="scroll-btn right"
                onClick={() => scroll(trendingRef, 'right')}
                aria-label="scroll right"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="slider-section">
            <h2 className="slider-heading">Top Rated</h2>
            <div className="slider-wrapper">
              <button
                type="button"
                className="scroll-btn left"
                onClick={() => scroll(topRatedRef, 'left')}
                aria-label="scroll left"
              >
                <FaChevronLeft size={20} />
              </button>
              <div className="slider-items-container" ref={topRatedRef}>
                {topRatedMovies.map(movie => (
                  <Link
                    to={`/movies/${movie.id}`}
                    key={movie.id}
                    className="movie-card-link"
                  >
                    <div className="movie-card">
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="movie-card-img"
                      />
                    </div>
                  </Link>
                ))}
              </div>
              <button
                type="button"
                className="scroll-btn right"
                onClick={() => scroll(topRatedRef, 'right')}
                aria-label="scroll right"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="slider-section">
            <h2 className="slider-heading">Originals</h2>
            <div className="slider-wrapper">
              <button
                type="button"
                className="scroll-btn left"
                onClick={() => scroll(originalsRef, 'left')}
                aria-label="scroll left"
              >
                <FaChevronLeft size={20} />
              </button>
              <div className="slider-items-container" ref={originalsRef}>
                {originalsMovies.map(movie => (
                  <Link
                    to={`/movies/${movie.id}`}
                    key={movie.id}
                    className="movie-card-link"
                  >
                    <div className="movie-card">
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="movie-card-img"
                      />
                    </div>
                  </Link>
                ))}
              </div>
              <button
                type="button"
                className="scroll-btn right"
                onClick={() => scroll(originalsRef, 'right')}
                aria-label="scroll right"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderHomeContent = () => {
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
    <div className="home-page">
      <Header />
      <div className="home-main-content">{renderHomeContent()}</div>
      <Footer />
    </div>
  )
}

export default HomeRoute
