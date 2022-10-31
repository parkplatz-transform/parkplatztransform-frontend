const strings = {
  // Start page
  welcome_title: () => 'Willkommen bei ParkplatzTransform',
  welcome_subtitle: () => 'Dies ist ein Tool zum Erfassen von Parkplätzen.',
  welcome_hints: () => 'So funktioniert das Eintragen: ',
  welcome_hint_1: () =>
    'Lege einen Account an, indem du dich mit deiner E-MailAdresse einloggst – ein Passwort ist nicht nötig.',
  welcome_hint_2: () =>
    'Um Zählergebnisse einzutragen, wähle zunächst einen vorhandenen Abschnitt aus oder erstelle einen neuen.',
  welcome_hint_3: () =>
    'Zoome dafür in die Karte. Links oben siehst du Icons für die Bearbeitungswerkzeuge, die du zum Abschnitt einzeichnen benötigst.',
  welcome_hint_4: () =>
    'Um nun in dem ausgewählten Abschnitt die gezählten Parkplätze zu erfassen, charakterisiere Unterabschnitte und definiere Parkplatztypen. Um den Aufwand gering zu halten, kannst du ganze Unterabschnitte kopieren, falls ein Parkplatzmuster mehr als einmal auftaucht.',
  welcome_hint_5: () =>
    'Es findet eine automatische Sicherung der eingetragenen Daten statt. Speichern und aktives Ausloggen ist nicht notwendig.',
  welcome_to_howto: () =>
    'Hier geht es zu einer detaillierten Nutzer*innenanleitung',

  // Alert success messages
  segment_create_success: () => 'Abschnitt erfolgreich erstellt.',
  segment_update_success: () => `Abschnitt erfolgreich gespeichert.`,
  segment_delete_success: (num) => {
    if (num === 1) {
      return 'Abschnitt gelöscht.'
    }
    return `${num} Abschnitte gelöscht.`
  },
  segment_loaded_success: () => 'Abschnitte erfolgreich geladen.',

  segment_delete_confirm: () => 'Segment löschen?',

  // Alert failure messages
  segment_create_failure: () => 'Abschnitt konnte nicht erstellt werden.',
  segment_update_failure: () => 'Abschnitt konnte nicht gespeichert werden.',
  subsegment_invalid: () => 'Mindestens ein Unterabschnitt ist fehlerhaft.',
  segment_delete_failure: (num) => {
    if (num === 1) {
      return 'Abschnitt konnte nicht gelöscht werden.'
    }
    return `${num} Abschnitte konnte nicht gelöscht werden.`
  },
  segment_has_been_deleted: () => {
    return `Dieser Abschnitt wurde gelöscht.`
  },
  segment_loaded_failure: () =>
    'Beim Laden der Abschnitte trat ein Fehler auf.',
  permissions_failure: () => 'Sorry, das hat nicht geklappt. Du hast leider keine Berechtigung, Abschnitte, die von anderen Nutzer*innen hinzugefügt wurden zu bearbeiten. Falls du die entsprechenden Rechte erhalten möchtest, wende dich an parkplatztransform@riseup.net.',

  // Download & Save buttons
  download_geo_json: () => 'Daten herunterladen',
  download_visible_segments: () => 'GeoJSON - sichtbarer Bereich',
  download_all_segments: () => 'GeoJSON - alle geladenen Bereiche',
  save: () => 'Speichern',

  // Form validation helper text
  helper_text_length: () => 'Länge oder Stellplatzzahl muss gesetzt werden.',
}

export default function getString(key, variable) {
  try {
    return strings[key](variable)
  } catch {
    console.error('missing translation key for:', key)
    return key
  }
}
