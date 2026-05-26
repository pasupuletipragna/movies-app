import {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

function MovieItemDetails() {
  const {id} = useParams()
  const [movieDetails, setMovieDetails] = useState(null)
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const getMovieDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
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
        const movie = data.movie_details
        
        const formattedMovie = {
          adult: movie.adult,
          backdropPath: movie.backdrop_path,
          budget: movie.budget,
          genres: movie.genres.map(g => ({id: g.id, name: g.name})),
          id: movie.id,
          overview: movie.overview,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date,
          runtime: movie.runtime,
          spokenLanguages: movie.spoken_languages.map(l => ({
            id: l.id,
            englishName: l.english_name,
          })),
          title: movie.title,
          voteAverage: movie.vote_average,
          voteCount: movie.vote_count,
          similarMovies: movie.similar_movies.map(sm => ({
            id: sm.id,
            title: sm.title,
            posterPath: sm.poster_path,
            backdropPath: sm.backdrop_path,
          })),
        }
        
        setMovieDetails(formattedMovie)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getMovieDetails()
  }, [id])

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
      <button type="button" className="try-again-btn" onClick={getMovieDetails}>
        Try Again
      </button>
    </div>
  )

  const formatRuntime = runtimeMinutes => {
    const hours = Math.floor(runtimeMinutes / 60)
    const minutes = runtimeMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const renderSuccessView = () => {
    if (!movieDetails) return null

    const {
      backdropPath,
      title,
      overview,
      runtime,
      releaseDate,
      adult,
      genres,
      spokenLanguages,
      budget,
      voteAverage,
      voteCount,
      similarMovies,
    } = movieDetails

    const releaseYear = new Date(releaseDate).getFullYear()
    const formattedRuntime = formatRuntime(runtime)
    const certification = adult ? 'A' : 'U/A'

    return (
      <div className="details-container">
        <div
          className="details-hero-section"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.85) 100%), linear-gradient(to top, rgba(15,15,15,1) 0%, rgba(15,15,15,0) 25%), url(${backdropPath})`,
          }}
        >
          <div className="details-hero-content">
            <h1 className="details-title">{title}</h1>
            <div className="details-meta-row">
              <span className="details-meta-item">{formattedRuntime}</span>
              <span className="certification-badge">{certification}</span>
              <span className="details-meta-item">{releaseYear}</span>
            </div>
            <p className="details-description">{overview}</p>
            <button type="button" className="details-play-btn">
              Play
            </button>
          </div>
        </div>

        <div className="details-info-section">
          <div className="info-grid">
            <div className="info-col">
              <h2 className="info-label">Genres</h2>
              <ul className="info-list">
                {genres.map(genre => (
                  <li key={genre.id} className="info-val">
                    {genre.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="info-col">
              <h2 className="info-label">Audio Available</h2>
              <ul className="info-list">
                {spokenLanguages.map(lang => (
                  <li key={lang.id} className="info-val">
                    {lang.englishName}
                  </li>
                ))}
              </ul>
            </div>

            <div className="info-col">
              <h2 className="info-label">Rating Information</h2>
              <div className="info-list">
                <span className="info-label-sub">Rating Count</span>
                <span className="info-val-sub">{voteCount}</span>
                <span className="info-label-sub">Rating Average</span>
                <span className="info-val-sub">{voteAverage}</span>
              </div>
            </div>

            <div className="info-col">
              <h2 className="info-label">Budget & Release</h2>
              <div className="info-list">
                <span className="info-label-sub">Budget</span>
                <span className="info-val-sub">{budget}</span>
                <span className="info-label-sub">Release Date</span>
                <span className="info-val-sub">
                  {new Date(releaseDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {similarMovies.length > 0 && (
          <div className="similar-movies-section">
            <h2 className="similar-movies-heading">More Like This</h2>
            <div className="similar-movies-grid">
              {similarMovies.map(movie => (
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
        )}
      </div>
    )
  }

  const renderMovieContent = () => {
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
    <div className="details-page">
      <Header />
      <div className="details-main-content">{renderMovieContent()}</div>
      <Footer />
    </div>
  )
}

export default MovieItemDetails
