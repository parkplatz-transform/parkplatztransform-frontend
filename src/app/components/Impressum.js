import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({
  container: {
    padding: '20px',
    textAlign: 'left',
  },
  mt: {
    marginTop: '20px',
  },
})

function Impressum() {
  const classes = useStyles()

  return (
    <Container className={classes.mt} maxWidth='lg'>
      <Paper>
        <div className={classes.container}>
          <h1>Impressum</h1>
          <p>
            <strong>Angaben gemäß § 5 TM</strong>
          </p>
          <p>XTransform e.V.</p>
          <p>ein Projekt von Changing Cities e.V.</p>
          <p>c/o PowerShift</p>
          <p>Greifswalder Str. 4</p>
          <p>10405 Berlin</p>
          <p>
            <strong>E-Mail:</strong> parkplatztransform[at]riseup.net
          </p>
          <p>
            <strong>Verantwortlich</strong>
          </p>
          <p>Vorstand: Luke Haywood, Henrike Junge, Christoph Keller</p>
          <p>Eingetragen beim Amtsgericht Charlottenburg: VR38420B</p>
          <p>
            Die Satzung des Vereins lässt sich 
            <a href='https://www.xtransform.org/images/Satzung-X-Tranform.pdf'>
              hier einsehen und herunterladen (PDF)
            </a>
            .
          </p>
          <p>
            <strong>Haftung für Inhalte</strong>
          </p>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen.
          </p>
          <p>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon
            unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
            Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
            Inhalte umgehend entfernen.
          </p>
          <p>
            <strong>Haftung für Links </strong>
          </p>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich. Die verlinkten Seiten wurden zum
            Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
            erkennbar.
          </p>
          <p>
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
            jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
            derartige Links umgehend entfernen.
          </p>
          <p>
            <strong>Urheberrecht</strong>
          </p>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            Downloads und Kopien dieser Seite sind nur für den privaten, nicht
            kommerziellen Gebrauch gestattet.
          </p>
          <p>
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
            werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
            trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
            wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </div>
      </Paper>
    </Container>
  )
}

export default Impressum
