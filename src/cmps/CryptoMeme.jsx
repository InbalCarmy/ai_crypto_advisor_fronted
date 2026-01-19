import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL


export function CryptoMeme() {
    const [currentMeme, setCurrentMeme] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadRandomMeme()
    }, [])

    async function loadRandomMeme() {
        try {
            setIsLoading(true)
            setError(null)


            const response = await fetch(`${API_URL}/api/meme`)

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
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
                    <img
                        src={currentMeme}
                        alt="Crypto meme"
                        className="meme-image"
                    />
            </div>
            <button onClick={loadRandomMeme} className="refresh-btn">
                Get Another Meme
            </button>
        </div>
    )
}
