// Server component — exports generateStaticParams for static export,
// then renders the client component with the experience ID.
import { EXPERIENCES } from "@/lib/mock-data";
import ExperiencePageClient from "./experience-client";

export function generateStaticParams() {
  return EXPERIENCES.map((exp) => ({ id: exp.id }));
}

export default function ExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  return <ExperiencePageClient params={params} />;
}
