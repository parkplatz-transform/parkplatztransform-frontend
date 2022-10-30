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

const HowTo = React.memo(() => {
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
              <li>
                <h3>
                  <a href='#favorits'>
                    5.Favoriten speichern
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
                      Melde dich mit deiner E-Mail-Adresse im Feld <i>LOGIN</i> an. Du bekommst einen Link an diese Adresse zugeschickt, mit dem du in die Bearbeitungsansicht der App gelangst.
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
                      Im gleichen Bereich (oben links) gibt es auch Bearbeitungswerkzeuge zum Einzeichnen von Linien / Polygonen. 
                    </div>
                    <div className='mt'>
                      Klicke auf das{' '}
                      <span className='bold'>oberste der vier Icons</span> um
                      einen neuen Abschnitt in die Karte einzuzeichnen.
                    </div>
                  </Grid>
                  <Grid item sm={12} className='mrAuto'>
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
                      Ein neuer Abschnitt wird – wenn möglich – von Straßenecke zu Straßenecke bzw. Kreuzung zu Kreuzung gezeichnet, sollten sich in diesem Abschnitt verschiedene Parkplatztypen befinden, werden diese als Unterabschnitte eingetragen (siehe unten).
                    </li>

                    <li className='mt'>
                      Die Linie sollte rechts bzw. links der Straße eingezeichnet werden, sodass klar wird, auf welcher Straßenseite sich die Parkplätze befinden. Wenn sich sowohl auf der rechten als auch der linken Straßenseite der gleiche Parkplatztyp befindet, nehmen wir die Parkplätze trotzdem in getrennte Abschnitte je Straßenseite in die App auf.
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
                      Nachdem Du auf das Linien-Icon geklickt hast, musst du einen Startpunkt des Abschnittes durch Klicken – am besten eine Straßenecke, siehe oben – bestimmen (im Beispiel unten ist der Startpunkt an der Ecke Branitzer Platz / Eichenstr)
                    </div>
                    <div className='mt'>
                      Danach kannst Du weitere Punkte durch Klicken setzen. Wenn du die Linie beenden möchtest, musst Du einen Doppelklick auf den gewünschten Endpunkt machen (im Beispiel Ecke Eichenstr / Lindensr).
                    </div>
                  </Grid>
                  <Grid item sm={12}>
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
                      <strong>Hinweis:</strong> Sollte die Straße eine Biegung haben, zeichne viele Punkte auf der Karte entlang der Biegung ein. 
                    </li>
                    <li className='mt'>
                      <strong>Nachträgliches Editieren der fertigen Linie:</strong> Wenn Du das Zeichnen der Linie mit einem Doppelklick auf den Endpunkt beendet hast, kannst Du diese anschließend als Ganzes „greifen“ (anklicken und gedrückt halten) und auf der Karte verschieben oder einzelne Punkte der Linie „greifen“ und diese bewegen. 
                    </li>
                    <li className='mt'>
                      <strong>Löschen von Abschnitten:</strong> Wenn Du mit deiner Linie nicht zufrieden bist und sie wieder löschen möchtest, klicke diese an und verwende das „Löschen“-Symbol, um sie zu entfernen. Auch alle evtl. für die Linie eingetragenen Daten werden dann gelöscht. 
                    </li>
                    <li className='mt'>
                      <strong>Achtung:</strong> Wenn du kein Superuser bist, kannst Du nur von dir gezeichnete Linien bearbeiten oder löschen. 
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
                      <span className='bold'>4.1</span> Wenn Du einen Abschnitt fertig eingezeichnet hast und durch das Klicken auf den letzten Punkt das Einzeichnen beendest, erscheint an der rechten Seite automatisch das Formular zur Erfassung von Unterabschnitten bzw. Parkplatz-Details. Sollte das Formular nicht automatisch erscheinen oder möchtest Du für eine bereits bestehende Linie das Eingabeformular öffnen, klicke die Linie an und dann auf den kleinen Stift oben rechts im Menu.
                    </div>
                    </Grid>
                    <Grid item sm={12}>
                    <img
                      className='image mt'
                      src={howtoSubsegment}
                      alt='How to mark'
                      width='100%'
                      height='auto'
                    />
                  </Grid>
                    <Grid item sm={7} className='mrAuto'>
                    <div className='mt'>
                      Im Eingabeformular trägst Du zunächst die Quelle der Daten ein. Wenn Du selbst im Straßenraum kartierst, wählst Du hier „Eigene Zählung“ aus. Darunter gibt es ein Kommentarfeld, in dem du Besonderheiten erfassen kannst, die sich nicht mit dem sonstigen Formular erfassen lassen.
                    </div>
                    <div className='mt'>
                      Indem du auf ‚Unterabschnitt hinzufügen‘ klickst, kannst Du die Details des Parkplatzes erfassen (Ausrichtung, Nutzungseinschränkungen etc.); Hier musst Du die in der Kartierung gesammelten Daten für den Abschnitt, den Du gerade eingezeichnet hast, übertragen.
                    </div>
                    <div className='mt'>
                      Wir geben in die App sowohl eigene Parkplatzzählungen, als auch bereits vorhandene Daten, die z.B. bei Machbarkeitsstudien ermittelt wurden ein. Für die Daten aus den Machbarkeitsstudien gilt, dass wir sie so genau wie möglich in die App übertragen. Es kann trotzdem vorkommen, dass für einige Felder die abgefragte Information unbekannt ist. Dann sollte das so vermerkt werden.
                    </div>
                  </Grid>
                </Grid>

                <Grid container className='mt-2'>
                  <Grid item sm={7} className='mrAuto'>
                    <div>
                      <span className='bold'>4.2</span> Insofern das Parken erlaubt ist, musst du mindestens
                      angeben, wie viele Parkplätze es in diesem Unterabschnitt
                      gibt oder auf welcher Länge es Parkplätze dieses Typs gibt
                    </div>
                  </Grid>
                  <Grid item sm={3} className='mrAuto'>
                    <div className='marginTopSmall textRight'>

                      <img
                        className='image marginTopSmall'
                        src={howtoLenght}
                        alt='How to length'
                        width='100%'
                        height='auto'
                      />
                      <small>4.2</small>
                    </div>
                  </Grid>
                </Grid>

                <Grid container className='mt-2'>
                  <Grid item sm={7} className='mrAuto'>
                    <div>
                      <span className='bold'>4.3</span> Warum die Unterscheidung von Gesamtabschnitt und Unterabschnitt? Es kann sein, dass in einem Abschnitt (von Kreuzung zu Kreuzung) Parkplätze unterschiedlichen Typs vorkommen (also z.B. erst 10 parallel zur Straße, dann 4 quer zur Straße und dann noch 2 quer zur Straße mit Ladestation für E-Autos). In so einem Fall sind pro Abschnitt mehrere Unterabschnitte notwendig. Das kann dann z.B. so am Ende aussehen.
                    </div>
                    <div className='mt'>
                      <strong>Wichtig:</strong> Die Unterabschnitte werden der Reihenfolge nach in Pfeilrichtung des von dir eingezeichneten Abschnitts eingetragen.
                    </div>
                    <div className='mt'>
                      Für den Fall, dass das Parken (z.B. durch eine Bushaltestelle) unterbrochen ist, kann eine Unterkategorie ‚kein Parken‘ festgelegt werden, indem du in der Rubrik ‚öffentliches Parken‘ ‚nie erlaubt‘ auswählst.
                    </div>
                  </Grid>
                  <Grid item sm={3} className='mrAuto textRight'>
                    <div className='marginTopSmall'>

                      <img
                        className='image marginTopSmall'
                        src={howtoSubsegments}
                        alt='How to subsegments'
                        width='100%'
                        height='auto'
                      />
                      <small>4.3</small>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <h3 id='favorits'>5. Favoriten speichern</h3>
                <Grid container>
                  <Grid item sm={7} className='mrAuto'>
                    <div>
                      Du kannst, falls Du den Eindruck hast, dass Parkplätze eines bestimmten Typs häufiger vorkommen, diesen Parkplatztypen als Favoriten speichern. Dafür musst Du, nachdem Du die Informationen des jeweiligen Abschnitts eingetragen hast, auf den Stern neben “Details” klicken. Nun musst du diesem Favoriten einen Namen geben (z.B. parallel, auf der Straße, Rest unbekannt (o.ä.)). Diesen Favoriten kannst Du dann in dem Dropdown-Menü unter  “Unterabschnitt hinzufügen” auswählen und musst nur noch die Informationen ändern, die neu oder anders sind. (Das spart Dir sehr viel Zeit) Die bereits vorhandenen Favoriten stammen aus den Studien von LK Argus.
                    </div>
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          </div>
        </div>
      </Paper>
    </Container>
  )
})

export default HowTo
