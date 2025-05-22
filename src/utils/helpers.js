export const truncateAddress = (address, chars = 4) => {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;

  const prefix = address.startsWith("0x") ? "0x" : "";
  const actualAddress = address.startsWith("0x") ? address.slice(2) : address;

  if (actualAddress.length <= chars * 2) return address;

  const start = actualAddress.substring(0, chars);
  const end = actualAddress.substring(actualAddress.length - chars);

  return `${prefix}${start}...${end}`;
};

export const formatCurrency = (
  value,
  decimals = 2,
  showDecimalsIfWhole = false
) => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  // Convert to number if it's a string
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Check if the number is a whole number (no decimal part)
  const isWholeNumber = Number.isInteger(numValue);

  // Format with thousand separators and decimals
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: isWholeNumber && !showDecimalsIfWhole ? 0 : decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(numValue);
};
