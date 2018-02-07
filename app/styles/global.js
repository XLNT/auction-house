import { injectGlobal } from "emotion";
import { sansSerif, colors } from "../styles";

injectGlobal`
  html,
  body {
    height: 100%;
  }
  body {
    background-color: #fff;
    margin: 0;
    padding: 0;
    font-family: ${sansSerif};
    line-height: 1.4;
  }
  a {
    color: ${colors.blue};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  hr {
    height: 0;
    border: 0 none;
    border-bottom: 1px solid ${colors.lightBorderGrey};
    width: 100%;
    margin: 20px 0;
  }
  small {
    font-size: smaller;
  }
  b,
  strong {
    font-weight: bold;
  }
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }
`;
