function parseHex(hex: string) {
  const normalized = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function toHex(value: number) {
  return Math.round(value).toString(16).padStart(2, '0');
}

function mixChannel(channel: number, target: number, amount: number) {
  return channel + (target - channel) * amount;
}

export function hexToNumber(hex: string) {
  const color = parseHex(hex);
  if (!color) return null;
  return (color.r << 16) | (color.g << 8) | color.b;
}

export function getShowcaseStageBackground(background: string) {
  const color = parseHex(background);
  if (!color) return background;

  const luminance =
    (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;

  if (luminance >= 0.18) return background;

  // A pure black stage erases the edge of dark media. Keep the project hue,
  // but reserve enough luminance for the carousel to read as separate planes.
  const lift = luminance < 0.09 ? 0.2 : 0.12;
  const r = Math.max(46, mixChannel(color.r, 255, lift));
  const g = Math.max(46, mixChannel(color.g, 255, lift));
  const b = Math.max(50, mixChannel(color.b, 255, lift));

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
