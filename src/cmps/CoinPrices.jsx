import { useState, useEffect, useCallback } from "react"
import { VotingButtons } from "./VotingButtons"
import { useSelector } from "react-redux"
import { feedbackService } from "../services/feedback.service"

const API_URL = import.meta.env.VITE_API_URL


export function CoinPrices({ cryptoAssets }) {
    const [coins, setCoins] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const user = useSelector(storeState => storeState.userModule.user)
    const [existingVote, setExistingVote] = useState(null)

    useEffect(() => {
        loadFeedback()
    },[])

    async function loadFeedback(){
        try{
            const today = new Date().toISOString().split('T')[0]
            const votes = await feedbackService.query({
                userId: user._id,
                sectionType: "coinPrices",
                date: today
            })
            setExistingVote(votes[0] || null)
        } catch (err) {
            console.log('error load feedbacks from CoinPrices', err);
        }
    }


    const loadCoinPrices = useCallback(async () => {

        if (!cryptoAssets || cryptoAssets.length === 0) {
            setIsLoading(false)
            return
        }

        if (!user || !user._id) {
            setIsLoading(false)
            return
        }
        

        try {
            setIsLoading(true)
            setError(null)

            const params = new URLSearchParams({
                assets: cryptoAssets.join(','),
                userId: user._id
            })

            const response = await fetch(`${API_URL}/api/coin-prices?${params}`, {
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()

            const coinArray = Object.keys(data).map(coinId => ({
                id: coinId,
                name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
                price: data[coinId].usd,
                change24h: data[coinId].usd_24h_change
            }))

            setCoins(coinArray)
        } catch (err) {
            console.error('Error loading coin prices:', err)
            setError(err.message || 'Failed to load coin prices')
        } finally {
            setIsLoading(false)
        }
    }, [cryptoAssets, user])

    useEffect(() => {
        loadCoinPrices()
    }, [loadCoinPrices])


    if (isLoading) {
        return (
            <div className="coin-prices-card">
                <h2>Coin Prices</h2>
                <p>Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="coin-prices-card">
                <h2>Coin Prices</h2>
                <div className="error">
                    <p>{error}</p>
                    <button onClick={loadCoinPrices} className="refresh-btn">
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (!cryptoAssets || cryptoAssets.length === 0) {
        return (
            <div className="coin-prices-card">
                <h2>Coin Prices</h2>
                <p>No cryptocurrencies selected. Update your preferences to see prices.</p>
            </div>
        )
    }

    if (coins.length === 0) {
        return (
            <div className="coin-prices-card">
                <h2>Coin Prices</h2>
                <p>No price data available</p>
            </div>
        )
    }

    return (
        <div className="coin-prices-card">
            <div className="coin-price-title">
                <h2>Coin Prices</h2>
                <VotingButtons sectionType="coinPrices" userId={user._id} existingVote={existingVote} />
            </div>
            <div className="coin-list">
                {coins.map(coin => (
                    <div key={coin.id} className="coin-item">
                        <div className="coin-info">
                            <span className="coin-name">{coin.name}</span>
                            <span className="coin-price">${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className={`coin-change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
                            {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
