import { AppNavbar } from '../../components/Navbar/Navbar'
import { useAuth } from '../../hooks/useAuth'
import gym3 from '../../assets/gym3.jpg'
import yoga2 from '../../assets/yoga2.png'
import yogaNews1 from '../../assets/yogaNews1.png'
import './HomePage.css'

export function HomePage() {
	const { isLoggedIn, firstName } = useAuth()

	return (
		<div>
			<AppNavbar />
			<div className="hero-section">
				<img src={gym3} alt="ZenGym" className="hero-image" />
				<div className="hero-content">
					{!isLoggedIn && (
						<>
							<h1>Välkommen till ZenGym!</h1>
							<h3>Logga in och boka upp dig på ett gympass!</h3>
						</>
					)}
					{isLoggedIn && firstName && (
						<h1>
							Välkommen, {firstName}, till ZenGym!{' '}
							<i className="bi bi-heart-fill heart-icon"></i>
						</h1>
					)}
				</div>
			</div>

			<div className="intro-container">
				<div className="intro-text">
					<h4>
						Välkommen till ZenGym – Din oas för balans och välmående
					</h4>
					<p>
						På ZenGym tror vi på kraften i stillhet, rörelse och
						närvaro. Vår studio är en plats där du får möjlighet att
						landa, andas ut och hitta tillbaka till dig själv – mitt
						i vardagens tempo. Hos oss möts traditionell
						yogafilosofi och modern träningsglädje i en harmonisk
						miljö skapad för kropp och sinne.
					</p>
					<p>
						Vi erbjuder ett brett utbud av pass med fokus på yoga,
						mindfulness och holistisk träning. Oavsett om du är
						nybörjare eller erfaren yogi hittar du klasser som
						passar just dig – från mjuk yin yoga och avslappnande
						meditation, till flödande vinyasa och stärkande
						core-pass. Allt under ledning av våra passionerade
						instruktörer som guidar dig med närvaro och omtanke.
					</p>

					<p>
						ZenGym är mer än bara ett gym – det är en gemenskap. En
						plats där du kan släppa prestation och istället lyssna
						inåt. Här är alla välkomna, precis som de är. Välkommen
						att boka ditt pass, rulla ut mattan och ge dig själv
						stunden du förtjänar. ZenGym – för din inre balans.
					</p>
				</div>
				<div className="intro-image">
					<img src={yoga2} alt="Yoga Pose" />
				</div>
			</div>

			<div className="news-container">
				<div className="news-photo">
					<img src={yogaNews1} alt="Drawing pregnant yoga woman" />
				</div>
				<div className="intro-container">
					<div className="news-text">
						<h4>
							<strong>Nyhet: Gravidyoga på ZenGym</strong>
						</h4>
						<p>
							Vi är glada att meddela att vi nu erbjuder
							gravidyoga – en trygg och varsam träningsform
							anpassad för dig som väntar barn. Genom mjuka
							rörelser, medveten andning och fokus på närvaro, får
							du möjlighet att stärka kroppen, minska stress och
							skapa en djupare kontakt med dig själv och ditt
							växande barn.
						</p>

						<p>
							Våra pass leds av erfarna instruktörer med särskild
							kunskap inom gravidyoga, och passar både dig som är
							ny med yoga och dig som har tidigare erfarenhet.
							Oavsett trimester får du stöd att lyssna inåt, landa
							i nuet och skapa lugn inför förlossningen.
						</p>

						<p>
							Ge dig själv och ditt barn en stunds omtanke – i en
							varm och tillåtande miljö.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
