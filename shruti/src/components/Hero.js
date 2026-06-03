import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token");

    return (
        <section className="hero">
            <h1>Build Your Developer Portfolio</h1>
            <p>
                Create stunning portfolios from GitHub repositories or manual input. Showcase your projects to the world.
            </p>
            <button 
                className="btn" 
                onClick={() => navigate(isLoggedIn ? "/create" : "/signup")}
            >
                {isLoggedIn ? "Create Portfolio" : "Get Started"}
            </button>
        </section>
    );
}
export default Hero;