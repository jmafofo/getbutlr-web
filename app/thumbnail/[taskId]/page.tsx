import ThumbnailScorePage from "../ThumbnailScorePage";

interface Props {
  params: { taskId: string };
}

export default function ThumbnailPage({ params }: Props) {
  const { taskId } = params;

  return <ThumbnailScorePage taskId={taskId} />;
}