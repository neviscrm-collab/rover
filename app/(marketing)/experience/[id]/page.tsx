// Server component — exports generateStaticParams for Catalyst Slate static export,
// then resolves the params Promise (Next.js 15) and renders the client page.
import { EXPERIENCES } from "@/lib/mock-data";
import ExperiencePageClient from "./experience-client";

export function generateStaticParams() {
  return EXPERIENCES.map((exp) => ({ id: exp.id }));
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExperiencePageClient id={id} />;
}
