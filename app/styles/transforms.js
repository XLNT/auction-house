import tinycolor from "tinycolor2";

export function lighten(color, perc) {
  return tinycolor(color)
    .lighten(perc)
    .toString();
}

export function darken(color, perc) {
  return tinycolor(color)
    .darken(perc)
    .toString();
}
