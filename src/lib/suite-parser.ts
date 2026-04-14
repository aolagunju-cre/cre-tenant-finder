/**
 * Parses suite/floor information from a formatted address string.
 * Returns null if no suite information is found.
 */
export function parseSuite(address: string): { suite: string; floor: string } | null {
  const patterns = [
    /\b(?:Suite|Ste\.?|Ste)\s*([A-Za-z0-9\-]+)/i,
    /\b(?:Unit)\s*([A-Za-z0-9\-]+)/i,
    /\b(?:Floor|Fl\.?|Level)\s*([A-Za-z0-9\-]+)/i,
    /#\s*([A-Za-z0-9\-]+)/i,
  ];

  for (const pattern of patterns) {
    const match = address.match(pattern);
    if (match) {
      const raw = (match[1] ?? match[0]).trim();
      return { suite: raw, floor: raw };
    }
  }

  return null;
}

/**
 * Extracts the numeric floor from a suite string.
 * "Suite 400" -> 4, "Ste 12B" -> 12, "Floor 3" -> 3, "Unit 5A" -> 5
 */
export function extractFloor(suite: string): number | null {
  const numMatch = suite.match(/\d+/);
  return numMatch ? parseInt(numMatch[0], 10) : null;
}
