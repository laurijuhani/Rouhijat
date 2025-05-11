

type Params = Promise<{ id: string }>;

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  return (
    <div>Page</div>
  );
};

export default Page;

/*
{
id: 1,
name: "Oskari Knaapi",
nickname: "Leksa",
number: 47,
seasons: [
{
seasonId: 1,
games: 1,
points: {
goals: 2,
assists: 4,
pm: 1
}
},
{
seasonId: 2,
games: 1,
points: {
goals: 1,
assists: 2,
pm: 1
}
}
]
}

*/