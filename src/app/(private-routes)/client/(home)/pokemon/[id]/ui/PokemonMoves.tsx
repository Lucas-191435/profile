import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Swords, GraduationCap } from "lucide-react";
import { usePokeMove } from "@/services/queries/usePokeMove";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const typeColors: Record<string, string> = {
  fire: "bg-fire", water: "bg-water", grass: "bg-grass", electric: "bg-electric",
  normal: "bg-muted-foreground", poison: "bg-purple-500", ground: "bg-amber-700",
  fairy: "bg-pink-400", bug: "bg-lime-500", psychic: "bg-pink-500",
  flying: "bg-sky-400", fighting: "bg-orange-700", rock: "bg-amber-800",
  ghost: "bg-purple-700", ice: "bg-cyan-300", dragon: "bg-indigo-600",
  dark: "bg-zinc-700", steel: "bg-zinc-400",
};
const PokemonMoves = ({number, pokemonName}: {number: number, pokemonName: string}) => {
    const [fetchMoves, setFetchMoves] = useState(false);
    // const [learnedMoves, setLearnedMoves] = useState([]);
    // const [teachableMoves, setTeachableMoves] = useState([]);
    const { data: pokemonMoves, isLoading, error } = usePokeMove({ number, enabled: true },); 

    const handleGetMoves = () => {
        setFetchMoves(true);
    }
    if (isLoading) return <div>Loading moves...</div>;

    if(pokemonMoves) console.log(pokemonMoves?.length > 0 ? pokemonMoves[0] : "No moves");

    const learnedMoves = pokemonMoves
    ?.filter(m => m.learn_method === 'LEVEL_UP')
    .sort((a: any, b: any) => a.level - b.level) || [];
    const teachableMoves = pokemonMoves?.filter(m => m.learn_method == 'MACHINE') || [];
    const eggMoves = pokemonMoves?.filter(m => m.learn_method == 'EGG') || [];
    const tutorMoves = pokemonMoves?.filter(m => m.learn_method == 'TUTOR') || [];

    return (
        <section>
            <h2 className="font-display text-xl font-bold tracking-wide mb-4 flex items-center gap-2">
                <Swords className="h-5 w-5 text-accent" /> Movimentos
            </h2>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="font-body glow-red" onClick={handleGetMoves}>
                        <GraduationCap className="mr-2 h-4 w-4" /> Ver todos os movimentos
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border scrollbar-premium">
                    <DialogHeader>
                        <DialogTitle className="font-display text-lg tracking-wide">Movimentos de {pokemonName}</DialogTitle>
                        <DialogDescription className="font-body text-muted-foreground">
                            Movimentos aprendidos por nível e por ensino (TM/HM/Tutor).
                        </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="learned" className="mt-4">
                        <TabsList className="bg-secondary">
                            <TabsTrigger value="learned" className="font-body">Nível</TabsTrigger>
                            <TabsTrigger value="teachable" className="font-body">TM/Tutor</TabsTrigger>
                            <TabsTrigger value="egg" className="font-body">De Ovo</TabsTrigger>
                            <TabsTrigger value="tutor" className="font-body">De Tutor</TabsTrigger>
                        </TabsList>
                        <TabsContent value="learned" className="space-y-2 mt-4">
                            {learnedMoves.map((m) => (
                                <div key={m.name} className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-2 font-body">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full text-foreground ${typeColors[m.type as string] || "bg-muted"}`}>{m.type}</span>
                                        <span className="font-semibold">{m.name}</span>
                                    </div>
                                    <span className="text-muted-foreground text-sm">Nível {m.level}</span>
                                </div>
                            ))}
                        </TabsContent>
                        <TabsContent value="teachable" className="space-y-2 mt-4">
                            {teachableMoves.map((m) => (
                                <div key={m.name} className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-2 font-body">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full text-foreground ${typeColors[m.type as string] || "bg-muted"}`}>{m.type}</span>
                                        <span className="font-semibold">{m.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs border-accent/30">{m.learn_method}</Badge>
                                </div>
                            ))}
                        </TabsContent>
                        <TabsContent value="egg" className="space-y-2 mt-4">
                            {eggMoves.map((m) => (
                                <div key={m.name} className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-2 font-body">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full text-foreground ${typeColors[m.type as string] || "bg-muted"}`}>{m.type}</span>
                                        <span className="font-semibold">{m.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs border-accent/30">{m.learn_method}</Badge>
                                </div>
                            ))}
                        </TabsContent>
                        <TabsContent value="tutor" className="space-y-2 mt-4">
                            {tutorMoves.map((m) => (
                                <div key={m.name} className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-2 font-body">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full text-foreground ${typeColors[m.type as string] || "bg-muted"}`}>{m.type}</span>
                                        <span className="font-semibold">{m.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs border-accent/30">{m.learn_method}</Badge>
                                </div>
                            ))}
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog> 
        </section>
    )
}

export default PokemonMoves;