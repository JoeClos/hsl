import { Link } from "react-router-dom";

const HomePage = () => {
    return(
        <div>
            <h1>Wellcome to Helsinki City Bikes</h1>
            <Link to={`/journeys`}>Journeys</Link>
            <Link to={`/stations`}>Stations</Link>
        </div>
    )
}

export default HomePage;