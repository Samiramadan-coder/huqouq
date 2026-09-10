import Form from "@/components/client-lawyer/client/cases/form";

type SearchParams = {
  lawyerId?: string;
};

export default async function page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { lawyerId } = await searchParams;

  return <Form lawyerId={lawyerId} />;
}
