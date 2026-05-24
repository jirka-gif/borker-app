import { redirect } from "next/navigation";

/**
 * Root – middleware běžně přesměruje "/" podle stavu přihlášení.
 * Tato stránka je fallback, kdyby middleware neběžel.
 */
export default function RootPage() {
  redirect("/login");
}
