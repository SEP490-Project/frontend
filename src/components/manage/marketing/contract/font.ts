import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: "/fonts/Montserrat-Regular.ttf",
      fontWeight: "normal",
      fontStyle: "normal",
    },
    {
      src: "/fonts/Montserrat-Bold.ttf",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    {
      src: "/fonts/Montserrat-Italic.ttf",
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: "/fonts/Montserrat-BoldItalic.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});
