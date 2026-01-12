import { AuthGuard } from "@/components/AuthGuard";
import { AppLayout } from "@/components/AppLayout";
import { EditTaskClient } from "@/components/EditTaskClient";

type Params = Promise<{ id: string }>;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return [];
}

export default async function Page(props: { params: Params }) {
  const params = await props.params;

  return (
    <AuthGuard>
      <AppLayout>
        <EditTaskClient taskId={params.id} />
      </AppLayout>
    </AuthGuard>
  );
}
