export const getCountryName = (countryCode?: string, locale: string = "id") => {
  if (!countryCode) return null;

  try {
    return (
      new Intl.DisplayNames([locale], {
        type: "region",
      }).of(countryCode) ?? countryCode
    );
  } catch {
    return countryCode;
  }
};

export const getCountryRegionName = (
  countryCode?: string,
  countryRegionCode?: string,
  locale: string = "id"
) => {
  if (!countryCode || !countryRegionCode) return null;
  const isoCode = `${countryCode}-${countryRegionCode}`;

  const ISO_REGION_REGEX = /^[A-Z]{2}-[A-Z0-9]{1,3}$/;
  if (!ISO_REGION_REGEX.test(isoCode)) return null;

  try {
    return new Intl.DisplayNames([locale], {
      type: "region",
    }).of(isoCode);
  } catch {
    return null;
  }
};
