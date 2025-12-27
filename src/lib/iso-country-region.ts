export const getCountryName = (countryCode: string) => {
  const countryName = new Intl.DisplayNames(["id"], {
    type: "region",
  }).of(countryCode);
  return countryName || countryCode;
};

export const getCountryRegionName = (countryCode: string, countryRegionCode: string) => {
  if (!countryCode || !countryRegionCode) return null;
  const isoCode = `${countryCode}-${countryRegionCode}`;
  return new Intl.DisplayNames(["id"], {
    type: "region",
  }).of(isoCode);
};
