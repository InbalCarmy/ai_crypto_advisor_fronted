import { useState, useEffect } from "react"

export function AIInsight({ preferences }) {
    const [insight, setInsight] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadInsight()
    }, [preferences])

    async function loadInsight() {
        try {
            setIsLoading(true)
            setError(null)

            const cryptoAssets = preferences?.cryptoAssets || []
            const investorType = preferences?.investorType?.[0] || 'General'

            const params = new URLSearchParams({
                assets: cryptoAssets.join(','),
                investorType: investorType
            })
            

            const response = await fetch(`http://localhost:3030/api/ai-insight?${params}`)

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            
            setInsight(data.insight)
        } catch (err) {
            console.error('Error loading AI insight:', err)
            setError(err.message || 'Failed to load AI insight')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="ai-insight-card">
                <h2>AI Insight of the Day</h2>
                <p>Generating personalized insight...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="ai-insight-card">
                <h2>AI Insight of the Day</h2>
                <p className="error">{error}</p>
                <button onClick={loadInsight}>Retry</button>
            </div>
        )
    }

    return (
        <div className="ai-insight-card">
        <div className="card-header">
            <svg
            viewBox="0 0 500 500"
            width="32"
            height="32"
            aria-hidden
            className="ai-icon"
            >
            <g>
                <path d="M287 36.5c0 20.158-16.342 36.5-36.5 36.5S214 56.658 214 36.5 230.342 0 250.5 0 287 16.342 287 36.5z" />
                <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M250.5 73H188c-54.858 0-101.396 35.624-117.743 85H68c-37.555 0-68 30.445-68 68s30.445 68 68 68h1.614c15.74 50.411 62.79 87 118.386 87h125c55.596 0 102.647-36.589 118.386-87H432c37.555 0 68-30.445 68-68s-30.445-68-68-68h-1.257C414.396 108.624 367.858 73 313 73zm121.186 145c0 25.637-20.784 46.421-46.422 46.421S278.843 243.637 278.843 218c0-25.638 20.783-46.422 46.421-46.422s46.422 20.784 46.422 46.422zm-197.265 46.421c25.638 0 46.422-20.784 46.422-46.421 0-25.638-20.784-46.422-46.422-46.422C148.784 171.578 128 192.362 128 218c0 25.637 20.784 46.421 46.421 46.421z"
                />
                <path d="M89.915 500c29.958-58.197 90.623-98 160.585-98s130.627 39.803 160.585 98z" />
            </g>
            </svg>

            <h2>AI Insight of the Day</h2>
        </div>
        <div className="insight-content">
        <p className="insight-text">{insight}</p>
        </div>
            <button onClick={loadInsight} className="refresh-btn">
                Get New Insight
            </button>
        </div>
    )
}
