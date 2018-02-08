import tinycolor from "tinycolor2";
import { css } from "react-emotion";

export const lighten = (color, perc) => {
  return tinycolor(color)
    .lighten(perc)
    .toString();
};

export const darken = (color, perc) => {
  return tinycolor(color)
    .darken(perc)
    .toString();
};

export const transform = arg => {
  return css`
    -ms-transform: ${arg}; /* IE 9 */
    -webkit-transform: ${arg}; /* Safari */
    transform: ${arg};
  `;
};
