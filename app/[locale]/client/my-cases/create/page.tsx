import Form from "@/components/client-lawyer/client/cases/form";

type SearchParams = {
  lawyerId?: string;
  specializations?: string;
};

export default async function page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { lawyerId, specializations } = await searchParams;

  return <Form lawyerId={lawyerId} specializations={specializations} />;
}
