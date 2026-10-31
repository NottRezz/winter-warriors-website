import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section py-24 text-center">
      <p className="eyebrow">Offside</p>
      <h1 className="display mt-3 text-4xl text-white sm:text-6xl">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-ice-300">
        That page isn&apos;t on the ice. Head back to centre.
      </p>
      <Link href="/" className="btn mt-8">
        Back to home
      </Link>
    </div>
  );
}
