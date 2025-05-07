import { AppNavbar } from '../../components/Navbar/Navbar';
import { useAuth } from '../../hooks/useAuth';
import gym3 from '../../assets/gym3.jpg';
import './HomePage.css'

export function HomePage() {
    const { isLoggedIn, firstName } = useAuth();

    return (
        <div>
            <AppNavbar />
            <div className="hero-section">
            <img src={gym3} alt="ZenGym" className="hero-image"/>
                <div className="hero-content">
                <h1>Välkommen till ZenGym!</h1>
                <h3>Logga in och boka upp dig på ett gympass!</h3>
                {isLoggedIn && firstName && (
                    <h3>Hejsan {firstName}! <i className="bi bi-heart-fill heart-icon"></i></h3>
                )}
                </div>
            </div>
            <div>
                <h4>Test</h4>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <h4>Test</h4>
                <h4>Test</h4>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <h4>Test</h4>
                <h4>Test</h4>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <h4>Test</h4>
                <h4>Test</h4>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <h4>Test</h4>
            </div>
        </div>
    );
}
