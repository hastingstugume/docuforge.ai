import { ProjectOverviewPage } from "@/components/app/project-overview-page";

export default async function DashboardProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectOverviewPage projectId={projectId} />;
}
