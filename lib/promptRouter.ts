export function routePrompt(input) {
  if (input.includes('npc')) return 'Spawning character...';
  return 'Unknown command';
}