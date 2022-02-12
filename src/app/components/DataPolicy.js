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

const DataPolicy = React.memo(() => {
  const classes = useStyles()

  return (
    <Container className={classes.mt} maxWidth='lg'>
      <Paper>
        <div className={classes.container}>
          <h1>Datenschutzerklärung</h1>
          <p>
            <strong>Datenschutz</strong>
          </p>
          <p>
            Wir haben diese Datenschutzerklärung (Fassung 05.03.2021-311268789)
            verfasst, um Ihnen gemäß der Vorgaben der
            <a href='https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=celex%3A32016R0679&tid=311268789'>
              {' '}
              Datenschutz-Grundverordnung (EU) 2016/679
            </a>{' '}
            zu erklären, welche Informationen wir sammeln, wie wir Daten
            verwenden und welche Entscheidungsmöglichkeiten Sie als Besucher*in
            dieser Webseite haben. Datenschutzerklärungen klingen für gewöhnlich
            sehr technisch. Diese Version soll Ihnen hingegen die wichtigsten
            Dinge so einfach und klar wie möglich beschreiben. Soweit es möglich
            ist, werden technische Begriffe leserfreundlich erklärt. Außerdem
            möchten wir vermitteln, dass wir mit dieser Website nur dann
            Informationen sammeln und verwenden, wenn eine entsprechende
            gesetzliche Grundlage gegeben ist. Das ist sicher nicht möglich,
            wenn man möglichst knappe, technische Erklärungen abgibt, so wie sie
            im Internet oft Standard sind, wenn es um Datenschutz geht. Wir
            hoffen, Sie finden die folgenden Erläuterungen interessant und
            informativ und vielleicht ist die eine oder andere Information
            dabei, die Sie noch nicht kannten. Wenn trotzdem Fragen bleiben,
            möchten wir Sie bitten den vorhandenen Links zu folgen und sich
            weitere Informationen auf Drittseiten anzusehen, oder uns einfach
            eine E-Mail zu schreiben. Unsere Kontaktdaten finden Sie im
            <a href='https://www.xtransform.org/impressum.html'>Impressum</a>.
          </p>
          <h3>Automatische Datenspeicherung</h3>
          <p>
            Wenn Sie heutzutage Websites besuchen, werden gewisse Informationen
            automatisch erstellt und gespeichert, so auch auf dieser Website.
            Diese gesammelten Daten sollten möglichst sparsam und nur mit
            Begründung gesammelt werden. Mit Website meinen wir übrigens die
            Gesamtheit aller Webseiten auf unserer Domain, d.h. alles von der
            Startseite (Homepage) bis hin zur allerletzten Unterseite (wie
            dieser hier). Mit Domain meinen wir zum Beispiel beispiel.de oder
            musterbeispiel.com. Auch während Sie unsere Website jetzt gerade
            besuchen, speichert unser Webserver – das ist der Computer auf dem
            diese Webseite gespeichert ist – aus Gründen der Betriebssicherheit,
            zur Erstellung von Zugriffsstatistik usw. in der Regel automatisch
            Daten wie
          </p>
          <ul>
            <li>
              die komplette Internetadresse (URL) der aufgerufenen Webseite (z.
              B. https://www.beispielwebsite.de/beispielunterseite.html/)
            </li>
            <li>Browser und Browserversion (z. B. Chrome 87)</li>
            <li>das verwendete Betriebssystem (z. B. Windows 10)</li>
            <li>
              die Adresse (URL) der zuvor besuchten Seite (Referrer URL) (z. B.
              https://www.beispielquellsite.de/vondabinichgekommen.html/)
            </li>
            <li>
              den Hostname und die IP-Adresse des Geräts von welchem aus
              zugegriffen wird (z. B. COMPUTERNAME und 194.23.43.121)
            </li>
            <li>Datum und Uhrzeit</li>
            <li>in Dateien, den sogenannten Webserver-Logfiles.</li>
          </ul>
          <p>
            In der Regel werden diese Dateien zwei Wochen gespeichert und danach
            automatisch gelöscht. Wir geben diese Daten nicht weiter, können
            jedoch nicht ausschließen, dass diese Daten beim Vorliegen von
            rechtswidrigem Verhalten von Behörden eingesehen werden.
          </p>
          <p>
            Kurz gesagt: Ihr Besuch wird durch unseren Provider (Firma, die
            unsere Website auf speziellen Computern (Servern) laufen lässt),
            protokolliert, aber wir geben Ihre Daten nicht weiter!
          </p>
          <h3>Cookies</h3>
          <p>
            Unsere Website verwendet HTTP-Cookies um nutzerspezifische Daten zu
            speichern. Im Folgenden erklären wir, was Cookies sind und warum Sie
            genutzt werden, damit Sie die folgende Datenschutzerklärung besser
            verstehen.
          </p>
          <p>
            <bold>Was genau sind Cookies?</bold>
          </p>
          <p>
            Immer wenn Sie durch das Internet surfen, verwenden Sie einen
            Browser. Bekannte Browser sind beispielsweise Chrome, Safari,
            Firefox, Internet Explorer und Microsoft Edge. Die meisten Webseiten
            speichern kleine Text-Dateien in Ihrem Browser. Diese Dateien nennt
            man Cookies.
          </p>
          <p>
            Fast alle Webseiten verwenden Cookies. Genauer gesprochen sind es
            HTTP-Cookies, da es auch noch andere Cookies für andere
            Anwendungsbereiche gibt. HTTP-Cookies sind kleine Dateien, die von
            unserer Website auf Ihrem Computer gespeichert werden. Diese
            Cookie-Dateien werden automatisch im Cookie-Ordner, quasi dem “Hirn”
            Ihres Browsers, untergebracht. Ein Cookie besteht aus einem Namen
            und einem Wert. Bei der Definition eines Cookies müssen zusätzlich
            ein oder mehrere Attribute angegeben werden. Cookies speichern
            gewisse Nutzer*innendaten von Ihnen, wie beispielsweise Sprache oder
            persönliche Seiteneinstellungen. Wenn Sie unsere Seite wieder
            aufrufen, übermittelt Ihr Browser die „userbezogenen“ Informationen
            an unsere Seite zurück. Dank der Cookies weiß unsere Website, wer
            Sie sind und bietet Ihnen Ihre gewohnte Standardeinstellung. In
            einigen Browsern hat jedes Cookie eine eigene Datei, in anderen wie
            beispielsweise Firefox sind alle Cookies in einer einzigen Datei
            gespeichert.
          </p>
          <p>
            Es gibt sowohl Erstanbieter Cookies als auch Drittanbieter-Cookies.
            Erstanbieter-Cookies werden direkt von unserer Seite erstellt,
            Drittanbieter-Cookies werden von Partner-Webseiten (z.B. Google
            Analytics) erstellt. Jedes Cookie ist individuell zu bewerten, da
            jedes Cookie andere Daten speichert. Auch die Ablaufzeit eines
            Cookies variiert von ein paar Minuten bis hin zu ein paar Jahren.
            Cookies sind keine Software-Programme und enthalten keine Viren,
            Trojaner oder andere „Schädlinge“. Cookies können auch nicht auf
            Informationen Ihres PCs zugreifen.
          </p>
          <p>So können zum Beispiel Cookie-Daten aussehen:</p>
          <ul>
            <li>Name: _ga</li>
            <li>Ablaufzeit: 2 Jahre</li>
            <li>Verwendung: Unterscheidung der Webseitenbesucher</li>
            <li>Beispielhafter Wert: GA1.2.1326744211.152311268789</li>
          </ul>
          <p>Ein Browser sollte folgende Mindestgrößen unterstützen:</p>
          <ul>
            <li>Ein Cookie soll mindestens 4096 Bytes enthalten können</li>
            <li>
              Pro Domain sollen mindestens 50 Cookies gespeichert werden können
            </li>
            <li>
              Insgesamt sollen mindestens 3000 Cookies gespeichert werden können
            </li>
          </ul>
          <p>
            <bold>Welche Cookies verwenden wir auf unserer Seite?</bold>
          </p>
          <p>
            Wir selbst verwenden ausschließlich sogenannte “unbedingt
            notwendige”, temporäre Cookies, wenn Sie sich in unser Tool
            einloggen. Diese werden benötigt, um grundlegende Funktionen der
            Website sicherzustellen. Zum Beispiel braucht es diese Cookies, um
            nachzuverfolgen, welcher User Daten zur Datenbank hinzugefügt hat.
          </p>
          <p>
            Weitere Cookies (z.B. funktionelle, zielorientierte oder
            Werbe-Cookies) verwenden wir selbst nicht.
          </p>
          <p>
            Auf unserer Seite kommt eine Karte von OpenStreetMap zum Einsatz.
            OpenStreetMap verwendet Cookies. Die Details zu den verwendeten
            Cookies finden Sie im Abschnitt “Datenschutzerklärung
            OpenStreetMap”.
          </p>
          <p>
            <bold>Wie kann ich Cookies löschen?</bold>
          </p>
          Wie und ob Sie Cookies verwenden wollen, entscheiden Sie selbst.
          Unabhängig von welchem Service oder welcher Website die Cookies
          stammen, haben Sie immer die Möglichkeit Cookies zu löschen, nur
          teilweise zuzulassen oder zu deaktivieren. Wenn Sie feststellen
          möchten, welche Cookies in Ihrem Browser gespeichert wurden, wenn Sie
          Cookie-Einstellungen ändern oder löschen wollen, können Sie dies in
          Ihren Browser-Einstellungen finden:
          <p />
          <p>
            <a href='https://support.google.com/chrome/answer/95647?tid=311268789'>
              Chrome: Cookies in Chrome löschen, aktivieren und verwalten
            </a>
          </p>
          <p>
            <a href='https://support.apple.com/de-at/guide/safari/sfri11471/mac?tid=311268789'>
              Safari: Verwalten von Cookies und Websitedaten mit Safari
            </a>
          </p>
          <p>
            <a href='https://support.mozilla.org/de/kb/cookies-und-website-daten-in-firefox-loschen?tid=311268789'>
              Firefox: Cookies löschen, um Daten zu entfernen, die Websites auf
              Ihrem Computer abgelegt haben
            </a>
          </p>
          <p>
            <a href='https://support.microsoft.com/de-at/help/17442/windows-internet-explorer-delete-manage-cookies?tid=311268789'>
              Internet Explorer: Löschen und Verwalten von Cookies
            </a>
          </p>
          <p>
            <a href='https://support.microsoft.com/de-at/help/4027947/windows-delete-cookies?tid=311268789'>
              Microsoft Edge: Löschen und Verwalten von Cookies
            </a>
          </p>
          <p>
            Falls Sie grundsätzlich keine Cookies haben wollen, können Sie Ihren
            Browser so einrichten, dass er Sie immer informiert, wenn ein Cookie
            gesetzt werden soll. So können Sie bei jedem einzelnen Cookie
            entscheiden, ob Sie das Cookie erlauben oder nicht. Die
            Vorgangsweise ist je nach Browser verschieden. Am besten ist es Sie
            suchen die Anleitung in Google mit dem Suchbegriff “Cookies löschen
            Chrome” oder “Cookies deaktivieren Chrome” im Falle eines Chrome
            Browsers oder tauschen das Wort “Chrome” gegen den Namen Ihres
            Browsers, z.B. Edge, Firefox, Safari aus.
          </p>
          <p>
            <bold>Wie sieht es mit meinem Datenschutz aus?</bold>
          </p>
          <p>
            Seit 2009 gibt es die sogenannten „Cookie-Richtlinien“. Darin ist
            festgehalten, dass das Speichern von Cookies eine Einwilligung von
            Ihnen verlangt. Dies gilt jedoch nicht für die von uns verwendeten
            “unbedingt notwendigen Cookies”.
          </p>
          <p>
            Wenn Sie mehr über Cookies wissen möchten und technischen
            Dokumentationen nicht scheuen, empfehlen wir
            <a href='https://tools.ietf.org/html/rfc6265'>
              {' '}
              https://tools.ietf.org/html/rfc6265
            </a>
            , dem Request for Comments der Internet Engineering Task Force
            (IETF) namens “HTTP State Management Mechanism”.
          </p>
          <h3>Speicherung persönlicher Daten</h3>
          <p>
            Wenn Sie sich die über unser Tool erfassten Parkplatz-Daten ansehen
            oder herunterladen möchten, müssen Sie sich dazu nicht einloggen.
            Wir speichern in diesem Fall keine personenbezogenen Daten von
            Ihnen.
          </p>
          <p>
            Wenn Sie sich in das Tool von ParkplatzTransform einloggen, um
            selbst Daten zu öffentlichem Parkraum in unsere Datenbank
            einzutragen, müssen Sie sich mit Ihrer E-Mail Adresse anmelden. Ihre
            E-Mail Adresse speichern und nutzen wir ausschließlich, um Ihnen die
            Verwendung des Tools zur Erfassung von öffentlichem Parkraum zu
            ermöglichen. Ihre E-Mail-Adresse wird sicher auf Servern in
            Deutschland verwahrt und ohne Ihre Zustimmung nicht an Dritte
            weitergegeben. Wir können jedoch nicht ausschließen, dass Ihre Daten
            beim Vorliegen von rechtswidrigem Verhalten eingesehen werden.
          </p>
          <p>
            <bold>
              Detaillierte Informationen zur Speicherung und Verwendung Ihrer
              E-Mail-Adresse:
            </bold>
          </p>
          <p>
            Wir benötigen Ihre E-Mail-Adresse, um Ihnen einen Link zuzusenden,
            der Ihnen den Zugang zum “aktiven Modus” des Tools ermöglicht, über
            den Sie Parkplatz-Daten eintragen können.
          </p>
          <p>
            Nach dem Login wird Ihre E-Mail Adresse in unserer
            Nutzer*innen-Datenbank gespeichert. Dort wird ihr eine
            Nutzer*innen-ID zugewiesen. Wenn Sie mit unserem Tool
            Parkplatz-Daten in unsere Datenbank eintragen, speichern wir diese
            Nutzer*innen-ID zusammen mit den von Ihnen eingetragenen Daten. Die
            Zuordnung Ihrer ID zu Ihrer E-Mail-Adresse ist in einer separaten
            Tabelle gespeichert.
          </p>
          <p>
            Die Speicherung ihrer Nutzer*innen-ID mit den eingetragenen
            Parkplatz-Daten ist nötig, da nicht alle Nutzer*innen des Tools von
            Anfang an die gleichen Rechte haben. So können “normale User”
            beispielsweise nur ihre eigenen Daten editieren, erfahrene
            “Super-User” dagegen auch die Daten anderer Nutzer*innen bearbeiten.
            Über den Abgleich Ihrer Nutzer*innen-ID mit der eines Datensatzes
            können wir also identifizieren, ob Sie den Abschnitt bearbeiten
            dürfen oder nicht.
          </p>
          <p>
            Darüber hinaus können wir Ihnen durch die Speicherung Ihrer
            Nutzer*innen-ID Ihre persönliche Nutzer*innen-Statistik anzeigen
            (“Wie viele Parkplätze habe ich bereits erfasst?”). Zuletzt nutzen
            wir Ihre E-Mail-Adresse im Falle eines Verdachts auf Manipulation
            der Daten, um Sie kontaktieren zu können.
          </p>
          <p>
            Wenn Nutzer*innen unserer Seite die über unser Tool erfassten
            Parkplatz-Daten über den Button “Daten herunterladen” herunterladen,
            wird Ihre E-Mail-Adresse <bold>nicht</bold> mit übermittelt. Die
            Parkplatz-Daten enthalten lediglich die Nutzer*innen-ID, nicht Ihre
            E-Mail-Adresse.
          </p>
          <p>
            Die Rechtsgrundlage besteht nach{' '}
            <a href='https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&from=DE&tid=311268789'>
              Artikel 6 Absatz 1 a DSGVO
            </a>
            (Rechtmäßigkeit der Verarbeitung) darin, dass Sie uns die
            Einwilligung zur Verarbeitung der von Ihnen eingegebenen Daten
            geben. Sie können diesen Einwilligung jederzeit widerrufen – eine
            formlose E-Mail reicht aus, Sie finden unsere Kontaktdaten im
            <a href='https://www.xtransform.org/impressum.html'>Impressum</a>.
            Alle bis zum Zeitpunkt des Widerrufs erfolgten Datenverarbeitungen
            bleiben rechtmäßig.
          </p>
          <p>
            Im Falle eines Widerrufs werden wir Ihre E-Mail-Adresse aus unserer
            Nutzer*innen-Datenbank löschen. Die von Ihnen eingetragenen Daten
            bleiben erhalten. Sie sind weiterhin der Nutzer*innen-ID zugewiesen,
            die jedoch nicht mehr mit Ihrer E-Mail-Adresse in Verbindung
            gebracht werden kann.
          </p>
          <h3>Rechte laut Datenschutzgrundverordnung</h3>
          <p>
            Ihnen stehen laut den Bestimmungen der DSGVO grundsätzlich die
            folgende Rechte zu:
          </p>
          <ul>
            <li>Recht auf Berichtigung (Artikel 16 DSGVO)</li>
            <li>
              Recht auf Löschung („Recht auf Vergessenwerden“) (Artikel 17
              DSGVO)
            </li>
            <li>Recht auf Einschränkung der Verarbeitung (Artikel 18 DSGVO)</li>
            <li>
              Recht auf Benachrichtigung – Mitteilungspflicht im Zusammenhang
              mit der Berichtigung oder Löschung personenbezogener Daten oder
              der Einschränkung der Verarbeitung (Artikel 19 DSGVO)
            </li>
            <li>Recht auf Datenübertragbarkeit (Artikel 20 DSGVO)</li>
            <li>Widerspruchsrecht (Artikel 21 DSGVO)</li>
            <li>
              Recht, nicht einer ausschließlich auf einer automatisierten
              Verarbeitung — einschließlich Profiling — beruhenden Entscheidung
              unterworfen zu werden (Artikel 22 DSGVO)
            </li>
          </ul>
          <p>
            Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das
            Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche
            sonst in einer Weise verletzt worden sind, können Sie sich an die{' '}
            <a href='https://www.bfdi.bund.de/'>
              Bundesbeauftragte für den Datenschutz und die Informationsfreiheit
              (BfDI)
            </a>{' '}
            wenden.
          </p>
          <p>
            Wenn Sie uns persönliche Daten per E-Mail schicken – somit abseits
            dieser Webseite – können wir keine sichere Übertragung und den
            Schutz Ihrer Daten garantieren. Wir empfehlen Ihnen, vertrauliche
            Daten niemals unverschlüsselt per E-Mail zu übermitteln.
          </p>
          <h3>TLS-Verschlüsselung mit https</h3>
          <p>
            TLS, Verschlüsselung und https klingen sehr technisch und sind es
            auch. Wir verwenden HTTPS (das Hypertext Transfer Protocol Secure
            steht für „sicheres Hypertext-Übertragungsprotokoll“) um Daten
            abhörsicher im Internet zu übertragen. Das bedeutet, dass die
            komplette Übertragung aller Daten von Ihrem Browser zu unserem
            Webserver abgesichert ist – niemand kann “mithören”. Damit haben wir
            eine zusätzliche Sicherheitsschicht eingeführt und erfüllen
            Datenschutz durch Technikgestaltung{' '}
            <a href='https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&from=DE&tid=311268789'>
              Artikel 25 Absatz 1 DSGVO)
            </a>
            . Durch den Einsatz von TLS (Transport Layer Security), einem
            Verschlüsselungsprotokoll zur sicheren Datenübertragung im Internet
            können wir den Schutz vertraulicher Daten sicherstellen. Sie
            erkennen die Benutzung dieser Absicherung der Datenübertragung am
            kleinen Schlosssymbol links oben im Browser links von der
            Internetadresse (z. B. beispielseite.de) und der Verwendung des
            Schemas https (anstatt http) als Teil unserer Internetadresse. Wenn
            Sie mehr zum Thema Verschlüsselung wissen möchten, empfehlen wir die
            Google Suche nach “Hypertext Transfer Protocol Secure wiki” um gute
            Links zu weiterführenden Informationen zu erhalten.
          </p>
          <h3>OpenStreetMap Datenschutzerklärung</h3>
          <p>
            Wir haben auf unserer Website Kartenausschnitte des
            Online-Kartentools „OpenStreetMap“ eingebunden. Dabei handelt es
            sich um ein sogenanntes Open-Source-Mapping, welches wir über eine
            API (Schnittstelle) abrufen können. Angeboten wird diese Funktion
            von OpenStreetMap Foundation, St John’s Innovation Centre, Cowley
            Road, Cambridge, CB4 0WS, United Kingdom. Durch die Verwendung
            dieser Kartenfunktion wird Ihre IP-Adresse an OpenStreetMap
            weitergeleitet. In dieser Datenschutzerklärung erfahren Sie warum
            wir Funktionen des Tools OpenStreetMap verwenden, wo welche Daten
            gespeichert werden und wie Sie diese Datenspeicherung verhindern
            können.
          </p>
          <p>
            <bold>Was ist OpenStreetMap?</bold>
          </p>
          <p>
            Das Projekt OpenStreetMap wurde 2004 ins Leben gerufen. Ziel des
            Projekts ist und war es, eine freie Weltkarte zu erschaffen. User
            sammeln weltweit Daten etwa über Gebäude, Wälder, Flüsse und
            Straßen. So entstand über die Jahre eine umfangreiche, von Usern
            selbst erstellte digitale Weltkarte. Selbstverständlich ist die
            Karte, nicht vollständig, aber in den meisten Regionen mit sehr
            vielen Daten ausgestattet.
          </p>
          <p>
            <bold>Warum verwenden wir OpenStreetMap auf unserer Website?</bold>
          </p>
          <p>
            Unsere Website soll Ihnen in erster Linie hilfreich sein. Und das
            ist sie aus unserer Sicht immer dann, wenn man Information schnell
            und einfach findet. Da geht es natürlich einerseits um unsere
            Dienstleistungen und Produkte, andererseits sollen Ihnen auch
            weitere hilfreiche Informationen zur Verfügung stehen. Deshalb
            nutzen wir auch den Kartendienst OpenStreetMap. Denn so können wir
            Ihnen beispielsweise genau zeigen, wie Sie unsere Firma finden. Die
            Karte zeigt Ihnen den besten Weg zu uns und Ihre Anfahrt wird zum
            Kinderspiel.
          </p>
          <p>
            <bold>Welche Daten werden von OpenStreetMap gespeichert?</bold>
          </p>
          <p>
            Wenn Sie eine unserer Webseiten besuchen, die OpenStreetMap
            anbietet, werden Nutzerdaten an den Dienst übermittelt und dort
            gespeichert. OpenStreetMap sammelt etwa Informationen über Ihre
            Interaktionen mit der digitalen Karte, Ihre IP-Adresse, Daten zu
            Ihrem Browser, Gerätetyp, Betriebssystem und an welchem Tag und zu
            welcher Uhrzeit Sie den Dienst in Anspruch genommen haben. Dafür
            wird auch Tracking-Software zur Aufzeichnung von Userinteraktionen
            verwendet. Das Unternehmen gibt hier in der eigenen
            Datenschutzerklärung das Analysetool „Piwik“ an. Die erhobenen Daten
            sind in Folge den entsprechenden Arbeitsgruppen der OpenStreetMap
            Foundation zugänglich. Laut dem Unternehmen werden persönliche Daten
            nicht an andere Personen oder Firmen weitergegeben, außer dies ist
            rechtlich notwendig. Der Drittanbieter Piwik speichert zwar Ihre
            IP-Adresse, allerdings in gekürzter Form. Folgendes Cookie kann in
            Ihrem Browser gesetzt werden, wenn Sie mit OpenStreetMap auf unserer
            Website interagieren:
          </p>
          <p>
            <bold>Name:</bold> _osm_location
          </p>
          <p>
            <bold>Wert:</bold> 9.63312%7C52.41500%7C17%7CM
          </p>
          <p>
            <bold>Verwendungszweck:</bold> Das Cookie wird benötigt, um die
            Inhalte von OpenStreetMap zu entsperren.
          </p>
          <p>
            <bold>Ablaufdatum: </bold>nach 10 Jahren
          </p>
          <p>
            Wenn Sie sich das Vollbild der Karte ansehen wollen, werden Sie auf
            die OpenStreetMap-Website verlinkt. Dort können unter anderem
            folgende Cookies in Ihrem Browser gespeichert werden:
          </p>
          <p>
            <bold>Name:</bold> _osm_totp_token
          </p>
          <p>
            <bold>Wert:</bold> 148253311268789-2
          </p>
          <p>
            <bold>Verwendungszweck:</bold> Dieses Cookie wird benutzt, um die
            Bedienung des Kartenausschnitts zu gewährleisten.
          </p>
          <p>
            <bold>Ablaufdatum:</bold> nach einer Stunde
          </p>
          <p>
            <bold>Name:</bold> _osm_session
          </p>
          <p>
            <bold>Wert:</bold> 1d9bfa122e0259d5f6db4cb8ef653a1c
          </p>
          <p>
            <bold>Verwendungszweck:</bold> Mit Hilfe des Cookies können
            Sitzungsinformationen (also Userverhalten) gespeichert werden.
          </p>
          <p>
            <bold>Ablaufdatum:</bold> nach Sitzungsende
          </p>
          <p>
            <bold>Name:</bold> _pk_id.1.cf09
          </p>
          <p>
            <bold>Wert:</bold> 4a5.1593684142.2.1593688396.1593688396311268789-9
          </p>
          <p>
            <bold>Verwendungszweck:</bold> Dieses Cookie wird von Piwik gesetzt,
            um Userdaten wie etwa das Klickverhalten zu speichern bzw. zu
            messen.
          </p>
          <p>
            <bold>Ablaufdatum:</bold> nnach einem Jahr
          </p>
          <h3>Wie lange und wo werden die Daten gespeichert?</h3>
          <p>
            Die API-Server, die Datenbanken und die Server von Hilfsdiensten
            befinden sich derzeit im Vereinten Königreich (Großbritannien und
            Nordirland) und in den Niederlanden. Ihre IP-Adresse und
            Userinformationen, die in gekürzter Form durch das Webanalysetool
            Piwik gespeichert werden, werden nach 180 Tagen wieder gelöscht.
          </p>
          <h3>
            Wie kann ich meine Daten löschen bzw. die Datenspeicherung
            verhindern?
          </h3>
          <p>
            Sie haben jederzeit das Recht auf Ihre personenbezogenen Daten
            zuzugreifen und Einspruch gegen die Nutzung und Verarbeitung zu
            erheben. Cookies, die von OpenStreetMap möglicherweise gesetzt
            werden, können Sie in Ihrem Browser jederzeit verwalten, löschen
            oder deaktivieren. Dadurch wird allerdings der Dienst nicht mehr im
            vollen Ausmaß funktionieren. Bei jedem Browser funktioniert die
            Verwaltung, Löschung oder Deaktivierung von Cookies etwas anders. Im
            Folgenden finden Sie Links zu den Anleitungen der bekanntesten
            Browser:
          </p>
          <p>
            <a href='https://support.google.com/chrome/answer/95647?tid=311268789'>
              Chrome: Cookies in Chrome löschen, aktivieren und verwalten
            </a>
          </p>
          <p>
            <a href='https://support.apple.com/de-at/guide/safari/sfri11471/mac?tid=311268789'>
              Safari: Verwalten von Cookies und Websitedaten mit Safari
            </a>
          </p>
          <p>
            <a href='https://support.mozilla.org/de/kb/cookies-und-website-daten-in-firefox-loschen?tid=311268789'>
              Firefox: Cookies löschen, um Daten zu entfernen, die Websites auf
              Ihrem Computer abgelegt haben
            </a>
          </p>
          <p>
            <a href='https://support.microsoft.com/de-at/help/17442/windows-internet-explorer-delete-manage-cookies?tid=311268789'>
              Internet Explorer: Löschen und Verwalten von Cookies
            </a>
          </p>
          <p>
            <a href='https://support.microsoft.com/de-at/help/4027947/windows-delete-cookies?tid=311268789'>
              Microsoft Edge: Löschen und Verwalten von Cookies
            </a>
          </p>
          <p>
            Wenn Sie mehr über die Datenverarbeitung durch OpenStreetMap
            erfahren wollen, empfehlen wir Ihnen die Datenschutzerklärung des
            Unternehmens unter{' '}
          </p>
          <p>
            <a href='https://wiki.osmfoundation.org/wiki/Privacy_Policy?tid=311268789'>
              www.wiki.osmfoundation.org/wiki/Privacy_Policy
            </a>
            .
          </p>
          <p>
            Quelle: Erstellt mit dem{' '}
            <a href='https://www.adsimple.de/datenschutz-generator/'>
              Datenschutz Generator
            </a>
            von AdSimple
          </p>
        </div>
      </Paper>
    </Container>
  )
})

export default DataPolicy
