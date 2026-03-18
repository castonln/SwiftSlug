const inchesToPixels = (inches: number) => {
  // According to the CSS spec, 1 inch = 96 pixels
  const cssPixelsPerInch = 96;
  return inches * cssPixelsPerInch;
}

export default inchesToPixels;