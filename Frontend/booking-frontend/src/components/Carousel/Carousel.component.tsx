import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Carousel.component.css';

const classes = [
  {
    name: 'Cirkelpass',
    description:
      'Ett intensivt och roligt gruppass där vi tränar hela kroppen i olika stationer. Under ledning av en instruktör jobbar vi med styrka, kondition och uthållighet – allt i ett högt tempo men med utrymme för att anpassa efter din nivå. Perfekt för dig som vill svettas tillsammans med andra och få en varierad träning på kort tid.',
  },
  {
    name: 'Yin-Yoga',
    description:
      'Yin-yoga på Zen-Gym är en stillsam och återhämtande yogaklass där vi fokuserar på att öppna upp bindväv och leder genom längre positioner. Vi håller varje position i flera minuter och låter kroppen mjukna utan ansträngning. Perfekt för dig som vill hitta lugn, släppa spänningar och fördjupa din närvaro.',
  },
  {
    name: 'Flow-Dance',
    description:
      'En energifylld träningsklass som kombinerar dans, yoga och kroppskontroll i ett flödande pass. Här får du uttrycka dig genom rörelse, stärka kroppen och svettas i takt med musiken. Klassen leds av en inspirerande instruktör och passar både nybörjare och vana dansare.',
  },
  {
    name: 'Flex-Yoga',
    description:
      'Ett lugnt yogapass med fokus på flexibilitet, rörlighet och andning. Vi jobbar mjukt med kroppen och stretchar igenom stora muskelgrupper, samtidigt som vi bjuder in medveten andning och avslappning. Passar alla nivåer och är ett perfekt komplement till annan träning.',
  },
  {
    name: 'Gravidyoga',
    description:
      'En trygg och varsam träningsform anpassad för dig som väntar barn. Genom mjuka rörelser, medveten andning och fokus på närvaro, får du möjlighet att stärka kroppen, minska stress och skapa en djupare kontakt med dig själv och ditt växande barn. Passar både dig som är ny med yoga och dig som har tidigare erfarenhet.',
  },
];

export function AppCarousel() {
  return (
    <div className="container carousel-container">
      <Carousel interval={3500} indicators controls>
        {classes.map((klass, i) => (
          <Carousel.Item key={i}>
            <div className="d-flex flex-column align-items-center justify-content-center p-5 carousel-item-content">
              <h3>{klass.name}</h3>
              <p>{klass.description}</p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
