import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Nav";
import HomepageAddon from "../../components/page-addons/HomePage";

export default function Home () {

    const navigate = useNavigate();

    return (
      <>
        <Navbar />
        <HomepageAddon />
      </>
    )
};