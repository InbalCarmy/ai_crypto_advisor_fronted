import { useState, useEffect, useCallback } from "react"

export function MarketNews({ preferences }) {
    const [news, setNews] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadNews = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)

            // Get user's selected crypto assets to filter news
            const cryptoAssets = preferences?.cryptoAssets || []

            // Build currencies parameter (CryptoPanic uses uppercase symbols)
            const currenciesMap = {
                bitcoin: 'BTC',
                ethereum: 'ETH',
                cardano: 'ADA',
                solana: 'SOL',
                polygon: 'MATIC',
                ripple: 'XRP'
            }

            const currencies = cryptoAssets
                .map(asset => currenciesMap[asset])
                .filter(Boolean)
                .join(',')

            // Call our backend API instead of CryptoPanic directly
            const params = new URLSearchParams({
                currencies: currencies || 'BTC,ETH'
            })

            const response = await fetch(`http://localhost:3030/api/news?${params}`)

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()

            // Transform API response to our format
            const articles = data.results.map(article => ({
                id: article.id,
                title: article.title,
                source: article.source,
                url: article.url,
                publishedAt: formatTime(article.published_at),
                sentiment: article.votes?.positive > article.votes?.negative ? 'positive' :
                          article.votes?.negative > article.votes?.positive ? 'negative' : 'neutral'
            }))

            setNews(articles)
        } catch (err) {
            console.error('Error loading news:', err)
            setError(err.message || 'Failed to load news')
        } finally {
            setIsLoading(false)
        }
    }, [preferences])

    useEffect(() => {
        loadNews()
    }, [loadNews])

    function formatTime(timestamp) {
        const now = new Date()
        const published = new Date(timestamp)
        const diffMs = now - published
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 60) return `${diffMins} minutes ago`
        if (diffHours < 24) return `${diffHours} hours ago`
        return `${diffDays} days ago`
    }

    if (isLoading) {
        return (
            <div className="market-news-card">
                <h2>Market News</h2>
                <p>Loading news...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="market-news-card">
                <h2>Market News</h2>
                <p className="error">{error}</p>
                <button onClick={loadNews}>Retry</button>
            </div>
        )
    }

    return (
        <div className="market-news-card">
            <h2>Market News</h2>
            {news.length === 0 ? (
                <p>No news available at the moment.</p>
            ) : (
                <div className="news-list">
                    {news.map(article => (
                        <div key={article.id} className="news-item">
                            <div className="news-content">
                                <h3 className="news-title">{article.title}</h3>
                                <div className="news-meta">
                                    <span className="news-source">{article.source}</span>
                                    <span className="news-time">{article.publishedAt}</span>
                                </div>
                            </div>
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-link"
                            >
                                Read →
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
