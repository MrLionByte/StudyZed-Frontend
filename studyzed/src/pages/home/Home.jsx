import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Nav";
import HomepageAddon from "./components/HomePage.jsx";
import Snowfall from "react-snowfall"; 
import './style/home.css'

export default function Home () {

    const navigate = useNavigate();

    return (
      <div className="home">
        <Snowfall color="#fff" snowflakeCount={50} style={{zIndex: 1}}/>
        <Navbar />
        <HomepageAddon />
        
      </div>
    )
};