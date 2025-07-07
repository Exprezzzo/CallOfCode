export function routePrompt(input: string) {
  if (input.includes('npc')) return 'Spawning character...';
  return 'Unknown command';
}
