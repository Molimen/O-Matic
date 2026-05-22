export default function hexToBrightness(hex: string) {
    // remove #
    hex = hex.replace('#', '');

    // handle shorthand (#abc → #aabbcc)
    if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
    }

    // parse RGB
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    // gamma correction (this is the important part you skipped earlier)
    const toLinear = (v: number) =>
    v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);

    r = toLinear(r);
    g = toLinear(g);
    b = toLinear(b);

    // luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}