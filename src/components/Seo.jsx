import { Helmet } from "react-helmet-async";

export function Seo({ title, description }) {
  const fullTitle = title ? `${title} | Cartify` : "Cartify";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
