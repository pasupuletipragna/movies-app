import {useState, useEffect} from 'react'
import {useSearchParams, Link} from 'react-router-dom'
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

function SearchRoute() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [searchResults, setSearchResults] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const getSearchResults = async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      setApiStatus(apiStatusConstants.success)
      return
    }

    setApiStatus(apiStatusConstants.inProgress)
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${searchQuery}`
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
        setSearchResults(formattedData)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getSearchResults()
  }, [searchQuery])

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
      <button type="button" className="try-again-btn" onClick={getSearchResults}>
        Try Again
      </button>
    </div>
  )

  const renderNoResultsView = () => (
    <div className="no-results-container">
      <img
        src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660153719/movies%20prime%20app/No_Views_Border_h6sh5y.png"
        alt="no movies"
        className="no-results-img"
      />
      <p className="no-results-text">
        Your search for &quot;{searchQuery}&quot; did not find any matches.
      </p>
    </div>
  )

  const renderEmptySearchPrompt = () => (
    <div className="search-prompt-container">
      <p className="search-prompt-text">
        Type a query in the search bar above to find movies.
      </p>
    </div>
  )

  const renderSuccessView = () => {
    if (searchQuery.trim() === '') {
      return renderEmptySearchPrompt()
    }

    if (searchResults.length === 0) {
      return renderNoResultsView()
    }

    return (
      <div className="search-results-content">
        <h1 className="search-results-heading">Search Results</h1>
        <div className="search-results-grid">
          {searchResults.map(movie => (
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
  }

  const renderSearchContent = () => {
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
    <div className="search-page">
      <Header />
      <div className="search-main-content">{renderSearchContent()}</div>
      <Footer />
    </div>
  )
}

export default SearchRoute
