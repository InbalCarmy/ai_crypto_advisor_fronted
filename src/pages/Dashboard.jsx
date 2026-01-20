import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { CoinPrices } from "../cmps/CoinPrices"
import { MarketNews } from "../cmps/MarketNews"
import { AIInsight } from "../cmps/AIInsight"
import { CryptoMeme } from "../cmps/CryptoMeme"


export function Dashboard(){
    const user = useSelector(storeState => storeState.userModule.user)

    if(!user){
        return(
            <section className="dashboard-page">
                <div>
                    <h1>Please log in</h1>
                <Link to='/'>
                <button> login page </button>
                </Link>
                </div>
            </section>
        )
    }

    return(
        <section className="dashboard-page">
            <h1>Welcome back, {user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()}!</h1>

            <div className="dashboard-grid">
                <CoinPrices cryptoAssets={user.preferences?.cryptoAssets || []} />

                <MarketNews preferences={user.preferences} />

                <AIInsight preferences={user.preferences} />

                <CryptoMeme />
            </div>
        </section>

    )
}