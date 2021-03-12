import React from 'react'
import './components.css'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import howtoTools from '../images/howto-tools.png'
import howtoMark from '../images/howto-mark.png'
import howtoSubsegment from '../images/howto-subsegment.png'
import howtoSubsegments from '../images/howto-subsegments.png'
import howtoLenght from '../images/howto-length.png'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    lineHeight: '1.5rem',
  },
  container: {
    padding: '20px',
    textAlign: 'left',
  },
})

function HowTo() {
  const classes = useStyles()

  return (
    <Container className='mt' maxWidth='lg'>
      <Paper>
        <div className={classes.container}>
          <div className={classes.root}>
            <h1>Howto</h1>
            <ul className='listStyleNone mt-2'>
              <li>
                <h3>
                  <a href='#login'>1. Einloggen</a>
                </h3>
              </li>
              <li>
                <h3>
                  <a href='#enter'>2. Eintragen von Zählergebnissen</a>
                </h3>
              </li>
              <li>
                <h3>
                  <a href='#mark'>
                    3. Aber wie geht das überhaupt – Abschnitte einzeichnen?
                  </a>
                </h3>
              </li>
              <li>
                <h3>
                  <a href='#subsegments'>
                    4. Wie lege ich Unterabschnitte an und definiere
                    Parkplatztypen?
                  </a>
                </h3>
              </li>
            </ul>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h3 id='login'>1. Einloggen</h3>
                <Grid container>
                  <Grid item sm={7} className='mrAuto'>
                    <p>
                      Melde dich mit deiner E-Mail-Adresse im Feld <i>LOGIN</i>{' '}
                      an. Du bekommst einen Link an diese Adresse zugeschickt,
                      mit dem du in die Bearbeitungsansicht der App gelangst.
                    </p>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <h3 id='enter'>2. Eintragen von Zählergebnissen</h3>
                <Grid container>
                  <Grid item sm={7} className='mrAuto'>
                    <div>
                      Durch Scrollen, oder durch die +/- Tasten oben Links
                      kannst Du in den Bereich der Karte zoomen, in dem Du neue
                      Daten eingeben möchtest.
                    </div>
                    <div className='mt'>
                      Wenn Du weit genug in die Karte hineingezoomt hast,
                      erscheinen{' '}
                      <span className='bold'>
                        oben rechts die Bearbeitungswerkzeuge.
                      </span>
                    </div>
                    <div className='mt'>
                      Klicke auf das{' '}
                      <span className='bold'>oberste der drei Icons</span> um
                      einen neuen Abschnitt in die Karte einzuzeichnen.
                    </div>
                  </Grid>
                  <Grid item sm={7} className='mrAuto'>
                    <img
                      className='image mt'
                      src={howtoTools}
                      alt='How to tools'
                      width='100%'
                      height='auto'
                    />
                  </Grid>
                </Grid>
                <Grid item sm={7} className='mrAuto mt'>
                  <div className='mt'>
                    <strong>Dabei gilt:</strong>
                  </div>
                  <ul>
                    <li className='mt'>
                      Ein neuer Abschnitt wird – wenn möglich –{' '}
                      <span className='bold'>
                        von Straßenecke zu Straßenecke
                      </span>{' '}
                      bzw. Kreuzung zu Kreuzung gezeichnet, sollten sich in
                      diesem Abschnitt verschiedene Parkplatztypen befinden,
                      werden diese als Unterabschnitte eingetragen (siehe
                      unten).
                    </li>

                    <li className='mt'>
                      Die Linie sollte rechts bzw. links der Straße
                      eingezeichnet werden, sodass klar wird, auf welcher
                      Straßenseite sich die Parkplätze befinden. Wenn sich
                      sowohl auf der rechten als auch der linken Straßenseite
                      der gleiche Parkplatztyp befindet, nehmen wir die
                      Parkplätze trotzdem in getrennte{' '}
                      <span className='bold'>Abschnitte je Straßenseite</span>{' '}
                      in die App auf.
                    </li>
                  </ul>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <h3 id='mark'>
                  3. Aber wie geht das überhaupt – Abschnitte einzeichnen?
                </h3>
                <Grid container>
                  <Grid item sm={7} className='mrAuto'>
                    <div>
                      Nachdem Du auf das oberste Icon (Polyline zeichnen)
                      geklickt hast, musst du einen Startpunkt des Abschnittes
                      durch Klicken – am besten eine Straßenecke, siehe oben –
                      bestimmen (im Beispiel unten ist der Startpunkt an der
                      Ecke Gubener Straße/Wedekindstraße)
                    </div>
                    <div className='mt'>
                      Danach musst Du einen (vorläufigen) Endpunkt des
                      Abschnittes – wieder durch Klicken – bestimmen (im
                      Beispiel die Ecke Wedekindstraße/Marchlewskistraße);
                    </div>
                  </Grid>
                  <Grid item sm={7}>
                    <img
                      className='image mt'
                      src={howtoMark}
                      alt='How to mark'
                      width='100%'
                      height='auto'
                    />
                  </Grid>
                </Grid>
                <Grid item sm={7} className='mrAuto mt'>
                  <ul>
                    <li className='mt'>
                      sollte der Abschnitt tatsächlich hier beendet sein,{' '}
                      <span className='bold'>
                        musst du ein zweites Mal auf den gerade definierten
                        Endpunkt klicken,
                      </span>{' '}
                      der Abschnitt ist nun fixiert und du kannst damit
                      weitermachen, die Parkplätze einzutragen (siehe unten);
                    </li>
                    <li className='mt'>
                      sollte die Straße einen Knick o.ä. machen ohne, dass es
                      eine Kreuzung gibt, musst du den Abschnitt aber nicht am
                      zweiten Punkt beenden, sondern kannst einen weiteren Punkt
                      eintragen, der dann dein Endpunkt wird.
                    </li>
                    <li className='mt'>
                      sollte die Straße eine Biegung haben, zeichne trotzdem
                      erstmal ganz normal deinen Start und Endpunkt in die Karte
                      ein. Du kannst{' '}
                      <span className='bold'>
                        später über das zweite Icon oben Links deinen Abschnitt
                        bearbeiten
                      </span>{' '}
                      und Biegungen darstellen, indem du die Linie an den
                      Punkten, die auf der Linie erscheinen beliebig hin und
                      herziehst.
                    </li>
                  </ul>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <h3 id='subsegments'>
                  4. Wie lege ich Unterabschnitte an und definiere
                  Parkplatztypen?
                </h3>
                <Grid container className='mt'>
                  <Grid item sm={7} className='mrAuto'>
                    <div>
                      Wenn du einen Abschnitt fertig eingezeichnet hast und
                      durch das Klicken auf den letzten Punkt das Einzeichnen
                      beendest, erscheint an der rechten Seite automatisch das
                      Feld<i> Unterabschnitt</i>.
                    </div>
                    <div className='mt'>
                      Indem du auf ‚Unterabschnitt hinzufügen‘ klickst, öffnest
                      du die Bearbeitungsansicht; nun musst du die in der
                      Zählung gesammelten Daten für den Abschnitt, den du gerade
                      eingezeichnet hast, übertragen.
                    </div>
                  </Grid>
                  <Grid item sm={3} className='mrAuto textRight'>
                    <div className='marginTopSmall'>
                      <small>Unterabschnitt</small>
                      <img
                        className='image'
                        src={howtoSubsegment}
                        alt='How to Subsegment'
                        width='100%'
                        height='auto'
                      />
                    </div>
                  </Grid>
                </Grid>

                <Grid container className='mt'>
                  <Grid item sm={7} className='mrAuto'>
                    <div>
                      Insofern das Parken erlaubt ist, musst du mindestens
                      angeben, wie viele Parkplätze es in diesem Unterabschnitt
                      gibt oder auf welcher Länge es Parkplätze dieses Typs gibt
                    </div>
                  </Grid>
                  <Grid item sm={3} className='mrAuto'>
                    <img
                      className='image marginTopSmall'
                      src={howtoLenght}
                      alt='How to length'
                      width='100%'
                      height='auto'
                    />
                  </Grid>
                </Grid>

                <Grid container className='mt'>
                  <Grid item sm={7} className='mrAuto'>
                    <div>
                      Warum die Unterscheidung von Gesamtabschnitt und
                      Unterabschnitt? Es kann sein, dass in einem Abschnitt (von
                      Kreuzung zu Kreuzung) Parkplätze unterschiedlichen Typs
                      vorkommen (also z.B. erst 10 parallel zur Straße, dann 4
                      quer zur Straße und dann noch 2 quer zur Straße mit
                      Ladestation für E-Autos). In so einem Fall sind pro
                      Abschnitt mehrere Unterabschnitte notwendig. Das kann dann
                      z.B. so am Ende aussehen
                    </div>
                    <div className='mt'>
                      <strong>Wichtig:</strong> Die Unterabschnitte werden{' '}
                      <span className='bold'>
                        der Reihenfolge nach in Pfeilrichtung
                      </span>{' '}
                      des von dir eingezeichneten Abschnitts eingetragen.
                    </div>
                    <div className='mt'>
                      Für den Fall, dass das Parken (z.B. durch eine Ausfahrt)
                      unterbrochen ist, kann eine Unterkategorie ‚kein Parken‘
                      festgelegt werden, indem du in der Rubrik ‚öffentliches
                      Parken‘ ‚nicht erlaubt‘ auswählst.
                    </div>
                  </Grid>
                  <Grid item sm={3} className='mrAuto'>
                    <img
                      className='image marginTopSmall'
                      src={howtoSubsegments}
                      alt='How to subsegments'
                      width='100%'
                      height='auto'
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Paper>
    </Container>
  )
}

export default HowTo
