'use client';
import { useParams } from 'next/navigation';
import { useFindUniquePokemon } from "@/services/queries/usePokemon";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MoveLeft } from 'lucide-react'
import Description from './ui/Description';
import { Separator } from '@/components/ui/separator';
import Variations from './ui/Variations';
import Status from './ui/Status';
import Evolutions from './ui/Evolutions';
import { sounds } from '@/utils/sounds';
import PokemonMoves from './ui/PokemonMoves';
import CapturePokemon from './ui/CapturePokemon';

const PokemonPage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data, isLoading, error } = useFindUniquePokemon({ id: parseInt(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Error loading Pokemon</div>;



  return (
    <div className='px-8 md:px-12 py-6 space-y-4'>
      <div className='flex justify-between'>

        <Button variant="ghost" onClick={() => {
          sounds.click.play();
          router.push('/client')
        }}>
          <MoveLeft className="mr-2 hover:text-white" />
          Voltar à Pokedex
        </Button>

        <CapturePokemon pokemon={{ id: data.id, name: data.name }} />

      </div>

      <Description pokemon={data} />

      <Separator className="border-border" />

      <Status pokemon={data} />

      <Separator className="border-border" />

      <PokemonMoves number={data.number} pokemonName={data.name} />

      <Separator className="border-border" />

      <Variations pokemon={data} />

      <Separator className="border-border" />

      <Evolutions pokemon={data} />
    </div>
  );
}

export default PokemonPage;
