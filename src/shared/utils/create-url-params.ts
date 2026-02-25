interface CreateParams {
  [key: string]: string;
}

export const createUrlParams = (params: CreateParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  return `?${searchParams.toString()}`;
};
