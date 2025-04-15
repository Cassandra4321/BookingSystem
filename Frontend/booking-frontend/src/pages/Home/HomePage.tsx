import { Navbar } from '../../components/Navbar/Navbar';

export function HomePage() {
    return (
        <div>
            <Navbar />
            <div className="container text-center mt-5">
                <h1>Välkommen till vår hemsida!</h1>
                <p className="lead">Det här är en plats där du kan registrera dig och logga in.</p>
            </div>
        </div>
    );
}