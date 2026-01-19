export function parseEncounterName(encounterName: string) {
  // Remove non-letter characters
  return encounterName.replace(/[^a-zA-Z]/g, '');
}
