import { Navbar } from '../../components/Navbar/Navbar';
import { useAuth } from '../../hooks/useAuth'; 

export function HomePage() {
    const { isLoggedIn, firstName } = useAuth();

    return (
        <div>
            <Navbar />
            <div className="container text-center mt-5">
                <h1>Välkommen till ZenGym!</h1>
                <p className="lead">Logga in och boka upp dig på ett gympass!</p>
                {isLoggedIn && firstName && (
                    <p className="lead">Välkommen {firstName}!</p>
                )}
            </div>
        </div>
    );
}
