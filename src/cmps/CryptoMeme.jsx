import { useState, useEffect } from "react"

// Curated collection of crypto meme URLs
const CRYPTO_MEMES = [
    "https://i.imgflip.com/5c7lwq.jpg", // Is this a bull market?
    "https://i.imgflip.com/5c7m3f.jpg", // HODL
    "https://i.imgflip.com/6qlmjd.jpg", // Crypto investor vs reality
    "https://i.redd.it/7qvq8p0z8kb71.jpg", // Meanwhile at crypto
    "https://preview.redd.it/oivj8mww8w481.jpg?width=640&crop=smart&auto=webp&s=3a2f2e1234567890abcdef1234567890abcdef12", // When you check portfolio
    "https://i.imgflip.com/5c7lj2.jpg", // Buy high sell low
]

export function CryptoMeme() {
    const [currentMeme, setCurrentMeme] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadRandomMeme()
    }, [])

    function loadRandomMeme() {
        setIsLoading(true)
        // Get random meme from the collection
        const randomIndex = Math.floor(Math.random() * CRYPTO_MEMES.length)
        setCurrentMeme(CRYPTO_MEMES[randomIndex])
        setIsLoading(false)
    }

    if (isLoading) {
        return (
            <div className="crypto-meme-card">
                <h2>Crypto Meme</h2>
                <p>Loading meme...</p>
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
                    onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src = "https://via.placeholder.com/400x300?text=Meme+Not+Available"
                    }}
                />
            </div>
            <button onClick={loadRandomMeme} className="refresh-btn">
                <span className="icon">🎲</span> Get Another Meme
            </button>
        </div>
    )
}
