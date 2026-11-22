import type { Team } from "@/data/tournament";

const plural = (role: string) => (role.endsWith("Coach") ? `${role}es` : `${role}s`);

/** Coaches and staff, with everyone who shares a role grouped together. */
export function TeamStaff({ staff }: { staff: Team["staff"] }) {
  const roles = [...new Set(staff.map((person) => person.role))];

  return (
    <dl className="mt-6 grid gap-3 lg:grid-cols-4">
      {roles.map((role) => {
        const people = staff.filter((person) => person.role === role);
        const isLarge = people.length > 2;

        return (
          <div
            key={role}
            className={`grid content-start gap-x-5 gap-y-2 rounded-xl border-t-4 border-(--team-trim) bg-ink/55 p-5 ${
              isLarge ? "grid-cols-2 lg:col-span-2" : ""
            }`}
          >
            <dt className="col-span-full mb-1 text-sm text-ice-300">
              {people.length > 1 ? plural(role) : role}
            </dt>
            {people.map((person) => (
              <dd key={person.name} className="font-semibold text-white sm:text-lg">
                {person.name}
              </dd>
            ))}
          </div>
        );
      })}
    </dl>
  );
}
