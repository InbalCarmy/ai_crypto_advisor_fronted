import { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import { feedbackService } from "../services/feedback.service"
import { VotingButtons } from "./VotingButtons"

const API_URL = import.meta.env.VITE_API_URL

export function MarketNews({ preferences }) {
    const [news, setNews] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [existingVote, setExistingVote] = useState(null)
    const user = useSelector(storeState => storeState.userModule.user)

    useEffect(() => {
        loadFeedback()
    },[])

    async function loadFeedback(){
        try{
            const today = new Date().toISOString().split('T')[0]
            const votes = await feedbackService.query({
                userId: user._id,
                sectionType: "marketNews",
                date: today
            })
            // Get the first (and only) vote for this section
            setExistingVote(votes[0] || null)
        } catch (err) {
            console.log('error load feedbacks from MarketNews', err);
        }
    }
    

    const loadNews = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)


            // Get user's selected crypto assets to filter news
            const cryptoAssets = preferences?.cryptoAssets || []

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

            // Call our backend API
            const params = new URLSearchParams({
                currencies: currencies || 'BTC,ETH',
                userId: user._id
            })

            const response = await fetch(`${API_URL}/api/news?${params}`, {
                credentials: 'include'
            })

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
    }, [preferences, user._id])

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
            <div className="market-news-title">
                <h2>Market News</h2>
                <VotingButtons sectionType="marketNews" userId={user._id} existingVote={existingVote} />
            </div>

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
                            <div className="news-btns">
                                {article.url && (
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="news-link"
                                    >
                                        Read →
                                    </a> 
                                )}    
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
