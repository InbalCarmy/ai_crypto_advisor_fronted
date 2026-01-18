import { useState, useEffect } from "react"

const FALLBACK_COINS = [
  { id: "bitcoin", name: "Bitcoin", price: 42100, change24h: 1.25 },
  { id: "ethereum", name: "Ethereum", price: 2300, change24h: -0.40 },
  { id: "cardano", name: "Cardano", price: 0.55, change24h: 2.10 },
  { id: "solana", name: "Solana", price: 98.2, change24h: -1.35 },
  { id: "ripple", name: "Ripple", price: 0.62, change24h: 0.75 },
  { id: "polygon", name: "Polygon", price: 0.89, change24h: 1.05 },
];


export function CoinPrices({ cryptoAssets }) {
    const [isFallback, setIsFallback] = useState(false)
    const [coins, setCoins] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadCoinPrices()
    }, [cryptoAssets])

    async function loadCoinPrices() {
        if (!cryptoAssets || cryptoAssets.length === 0) {
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)
            setError(null)

            // Convert crypto names to CoinGecko IDs
            const coinIds = cryptoAssets.join(',')

            setIsFallback(false)

            // CoinGecko API endpoint with demo API key to help with rate limits
            const response = await fetch(
                 `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}` + `&vs_currencies=usd&include_24hr_change=true`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            )

            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment and refresh.')
            }

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

        // fallback: show static demo data filtered by user preferences
        const idsSet = new Set((cryptoAssets || []).map(a => a.toLowerCase()))
        const fallbackList = FALLBACK_COINS.filter(c => idsSet.has(c.id))

        setCoins(fallbackList.length ? fallbackList : FALLBACK_COINS.slice(0, 3))
        setIsFallback(true)
        setError(null)
        } finally {
            setIsLoading(false)
        }
    }

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
                <p className="error">{error}</p>
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

    return (
        <div className="coin-prices-card">
            {/* <h2>Coin Prices</h2> */}
            <h2>
                Coin Prices {isFallback && <span className="badge">Demo</span>}
            </h2>
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
