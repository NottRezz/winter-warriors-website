import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-[radial-gradient(70%_130%_at_85%_0%,var(--color-plum-800),var(--color-plum-950)_100%)]">
      <div className="section py-6 sm:py-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-2 text-3xl sm:mt-3 text-white sm:text-6xl">{title}</h1>
        {children && (
          <p className="mt-2 max-w-2xl text-ice-300 sm:mt-4 sm:text-lg">{children}</p>
        )}
      </div>
    </section>
  );
}
