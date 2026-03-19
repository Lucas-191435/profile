'use client';
import { useParams } from 'next/navigation';
import { useFindUniquePokemon } from "@/services/queries/usePokemon";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {MoveLeft} from 'lucide-react'

const PokemonPage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data, isLoading, error } = useFindUniquePokemon({ id: parseInt(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading Pokemon</div>;

  return (
    <div>
      <Button variant="outline" onClick={() => router.back()}>
        <MoveLeft className="mr-2" />
        Back to Pokemon List
      </Button>
      <h1>Pokemon Name: {data?.name}</h1>
    </div>
  );
}

export default PokemonPage;
