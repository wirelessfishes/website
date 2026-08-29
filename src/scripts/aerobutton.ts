import Color from "color";

// All colors are hexadecimal strings
export interface AeroButtonColors {
  border: string;

  regular: {
    base: string;
    lighter: string;
  };

  hover: {
    base: string;
    lighter: string;
  };
}

export function AeroButtonColors(color_str: string): AeroButtonColors {
  const base_color = Color(color_str);
  const lighter = base_color.lighten(0.3);

  return {
    border: base_color.lighten(0.5).fade(0.5).hexa(),

    regular: {
      base: base_color.hexa(),
      lighter: lighter.hexa(),
    },

    hover: {
      base: base_color.darken(0.15).hexa(),
      lighter: lighter.darken(0.15).hexa(),
    },
  };
}
