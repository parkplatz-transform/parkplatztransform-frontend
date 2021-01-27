
const strings = {
    welcome_title: () => 'Willkommen bei ParkplatzTransform',
    welcome_subtitle: () => 'Wähle einen vorhandenen Abschnitt oder erstelle einen Neuen',
    welcome_subtitle_2: () => 'Zoome in die Karte um die Bearbeitungswerkzeuge zu sehen',
    
    segment_create_success: () => 'Successfully created segement.',
    segment_update_success: () => `Successfully updated segment(s)`,
    segment_delete_success: (num) => `${num} Abschnitt(e) gelöscht`,
    segment_loaded_success: () => 'Successfully loaded all segments.',
    
    segment_create_failure: () => 'Failed to create segment',
    segment_update_failure: () => 'Failed to update segment(s)',
    segment_delete_failure: (num) => `Failed to delete ${num} segment(s).`,
    segment_loaded_failure: () => 'A problem occured loading all segments.'
}

export default function getString(key, variable) {
    try {
        return strings[key](variable)
    } catch {
        console.error("missing translation key for:", key)
        return key
    }
}