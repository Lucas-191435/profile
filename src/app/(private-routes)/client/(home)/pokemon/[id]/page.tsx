'use client';
import { useParams } from 'next/navigation';
import { useFindUniquePokemon } from "@/services/queries/usePokemon";
import Link from 'next/link';


const PokemonPage = () => {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useFindUniquePokemon({ id: parseInt(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading Pokemon</div>;

  return (
    <div>
      <Link href={`/client`} className="text-sm text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Pokemon List
      </Link>
      <h1>Pokemon Name: {data?.name}</h1>
    </div>
  );
}

export default PokemonPage;
