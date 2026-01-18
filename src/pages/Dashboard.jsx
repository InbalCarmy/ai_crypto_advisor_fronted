import { useSelector } from "react-redux"
import { Link } from "react-router-dom"


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
            <h1>Dashboard Page</h1>
        </section>
    )
}