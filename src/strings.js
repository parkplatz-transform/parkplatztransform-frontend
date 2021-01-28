
const strings = {
    // Start page
    welcome_title: () => 'Willkommen bei ParkplatzTransform',
    welcome_subtitle: () => 'Wähle einen vorhandenen Abschnitt oder erstelle einen Neuen',
    welcome_subtitle_2: () => 'Zoome in die Karte um die Bearbeitungswerkzeuge zu sehen',
    
    // Alert success messages
    segment_create_success: () => 'Abschnitt erfolgreich erstellt.',
    segment_update_success: () => `Abschnitte erfolgreich gespeichert.`,
    segment_delete_success: (num) => {
        if (num === 1) {
            return 'Abschnitt gelöscht.'
        }
        return `${num} Abschnitte gelöscht.`
    },
    segment_loaded_success: () => 'Abschnitte erfolgreich geladen.',
   
    // Alert failure messages
    segment_create_failure: () => 'Abschnitt konnte nicht erstellt werden.',
    segment_update_failure: () => 'Abschnitt konnte nicht gespeichert werden.',
    segment_delete_failure: (num) => {
        if (num === 1) {
            return "Abschnitt konnte nicht gelöscht werden."
        }
        return `${num} Abschnitte konnte nicht gelöscht werden.`
    },
    segment_loaded_failure: () => 'Beim Laden der Abschnitte trat ein Fehler auf.',

    // Download & Save buttons
    download_geo_json: () => 'Daten herunterladen',
    download_visible_segments: () => 'GeoJSON - sichtbaren Bereich',
    download_all_segments: () => 'GeoJSON - alle geladenen Bereiche',
    save: () => 'Speichern',

    // Form validation helper text
    helper_text_length: () => 'Länge oder Stellplatzzahl muss gesetzt werden.',
}


export default function getString(key, variable) {
    try {
        return strings[key](variable)
    } catch {
        console.error("missing translation key for:", key)
        return key
    }
}