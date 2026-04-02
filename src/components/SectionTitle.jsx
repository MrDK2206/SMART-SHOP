export function SectionTitle({ eyebrow, title, description, invert = false }) {
  return (
    <div>
      {eyebrow ? (
        <p
          className={`text-sm uppercase tracking-[0.22em] ${
            invert ? "text-brand-100" : "text-brand-600"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={`mt-2 font-display text-4xl font-bold sm:text-5xl ${
          invert ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={`mt-3 max-w-3xl text-sm leading-7 sm:text-base ${
            invert ? "text-slate-200" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
