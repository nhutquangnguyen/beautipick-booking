import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Force Vietnamese locale for all users
  const locale = "vi";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
