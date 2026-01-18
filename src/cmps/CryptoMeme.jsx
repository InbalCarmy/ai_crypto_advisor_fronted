import { useState, useEffect } from "react"

export function CryptoMeme() {
    const [currentMeme, setCurrentMeme] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [imageError, setImageError] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadRandomMeme()
    }, [])

    async function loadRandomMeme() {
        try {
            setIsLoading(true)
            setImageError(false)
            setError(null)

            const response = await fetch('http://localhost:3030/api/meme')

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            console.log("data url:", data.url);
            
            setCurrentMeme(data.url)
        } catch (err) {
            console.error('Error loading meme:', err)
            setError(err.message || 'Failed to load meme')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="crypto-meme-card">
                <h2>Crypto Meme</h2>
                <p>Loading meme...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="crypto-meme-card">
                <h2>Crypto Meme of the Day</h2>
                <div className="meme-container">
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: '#666'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😅</div>
                        <p>Failed to load meme</p>
                        <p style={{ fontSize: '0.9rem' }}>{error}</p>
                    </div>
                </div>
                <button onClick={loadRandomMeme} className="refresh-btn">
                     Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="crypto-meme-card">
            <h2>Crypto Meme of the Day</h2>
            <div className="meme-container">
                {imageError ? (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: '#666'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😅</div>
                        <p>Oops! This meme couldn't load</p>
                        <p style={{ fontSize: '0.9rem' }}>Try another one!</p>
                    </div>
                ) : (
                    <img
                        src={currentMeme}
                        alt="Crypto meme"
                        className="meme-image"
                        onError={() => setImageError(true)}
                    />
                )}
            </div>
            <button onClick={loadRandomMeme} className="refresh-btn">
                Get Another Meme
            </button>
        </div>
    )
}
