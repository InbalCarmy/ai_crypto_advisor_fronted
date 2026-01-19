import { useState, useEffect, useCallback } from "react"

export function CoinPrices({ cryptoAssets }) {
    const [coins, setCoins] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadCoinPrices = useCallback(async () => {
        if (!cryptoAssets || cryptoAssets.length === 0) {
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)
            setError(null)

            const params = new URLSearchParams({
                assets: cryptoAssets.join(',')
            })

            const response = await fetch(`http://localhost:3030/api/coin-prices?${params}`)

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()

            // Transform the data into an array format
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
    }, [cryptoAssets])

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
            <h2>Coin Prices</h2>
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
