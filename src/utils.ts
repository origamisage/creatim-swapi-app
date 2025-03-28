export function rgbaToHex(rgbaColor: string, backgroundColor: string) {
  // Parse the RGBA values
  const rgbaValues = rgbaColor.match(/\d+(\.\d+)?/g);
  // Parse the background color RGB values
  const bgValues = backgroundColor.match(/\d+(\.\d+)?/g);

  if (rgbaValues && bgValues) {
    const r = parseInt(rgbaValues[0]);
    const g = parseInt(rgbaValues[1]);
    const b = parseInt(rgbaValues[2]);
    const a = parseFloat(rgbaValues[3]);

    const bgR = parseInt(bgValues[0]);
    const bgG = parseInt(bgValues[1]);
    const bgB = parseInt(bgValues[2]);

    // Blend RGBA color with the background color
    const blendedR = Math.round((1 - a) * bgR + a * r);
    const blendedG = Math.round((1 - a) * bgG + a * g);
    const blendedB = Math.round((1 - a) * bgB + a * b);

    // Convert blended color to Hex
    const hexColor = `#${((1 << 24) + (blendedR << 16) + (blendedG << 8) + blendedB).toString(16).slice(1)}`;

    return hexColor;
  }
  return backgroundColor;
}
