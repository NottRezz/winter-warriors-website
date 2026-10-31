import type { LucideIcon } from "lucide-react";
import { tournament } from "@/data/tournament";

/** Stands in for a section until its content is added to the data file. */
export function ComingSoon({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: string;
}) {
  const { contactEmail } = tournament;

  return (
    <div className="panel p-6 sm:p-8">
      <Icon aria-hidden className="size-6 text-bronze-300" />
      <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-1.5 max-w-lg text-ice-300">{children}</p>
      {contactEmail && (
        <a
          href={`mailto:${contactEmail}`}
          className="text-link mt-4 text-bronze-300 hover:text-parchment"
        >
          {contactEmail}
        </a>
      )}
    </div>
  );
}
