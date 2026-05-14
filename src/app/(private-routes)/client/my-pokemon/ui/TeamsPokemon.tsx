/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyPokemonContext } from "@/context/MyPokemonContext";
import { Button } from "@/components/ui/button";
import { Plus, X, Swords, Shield, Edit, XSquare } from "lucide-react";
import { Team } from "@/types/IMyPokemon";
import { sounds } from "@/utils/sounds";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PokemonMoveList from "./PokemonMoveList";
import typeColors from "@/utils/typesColors";

const emptyTeam = (name: string): Team => ({
    name,
    slots: Array.from({ length: 6 }, () => ({ pokemonId: null, moves: [] })),
});

const teamsName = {
    "Time Alpha": "teamAlpha",
    "Time Beta": "teamBeta",
    "Time Gamma": "teamGamma",
}

const teamsIdx = {
    "teamAlpha": 0,
    "teamBeta": 1,
    "teamGamma": 2,
}

const defaultTeams: Team[] = [
    emptyTeam("Time Alpha"),
    emptyTeam("Time Beta"),
    emptyTeam("Time Gamma"),
];

const TeamsPokemon = () => {
    const {
        pokemons,
        isLoading: contextLoading,
        error,
        myCollection,
        teamSelected, setTeamSelected,
        handleSubmitTeam
    } = useMyPokemonContext();
    const myPokemon = pokemons || [];
    const [isEditTeam, setIsEditTeam] = useState(false);
    const [isEditMove, setIsEditMove] = useState(false);
    const [teams, setTeams] = useState<Team[]>([...defaultTeams]);
    const [selectedTeamIdx, setSelectedTeamIdx] = useState(0);
    const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(null);
    const [editTeam, setEditTeam] = useState<Team | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [addSlotIdx, setAddSlotIdx] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem("pokemon-teams", JSON.stringify(teams));
    }, [teams]);

    useEffect(() => {
        if (pokemons) {
            const teamApha = pokemons?.filter((p) => p.teamAlpha === true).map((p) => p.id) || [];
            const teamBeta = pokemons?.filter((p) => p.teamBeta === true).map((p) => p.id) || [];
            const teamGamma = pokemons?.filter((p) => p.teamGamma === true).map((p) => p.id) || [];
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTeams([
                {
                    name: "Time Alpha",
                    slots: [
                        ...teamApha.map((id) => ({ pokemonId: id, moves: [] })),
                        ...Array(6 - teamApha.length).fill({ pokemonId: null, moves: [] })
                    ],
                },
                {
                    name: "Time Beta",
                    slots: [
                        ...teamBeta.map((id) => ({ pokemonId: id, moves: [] })),
                        ...Array(6 - teamBeta.length).fill({ pokemonId: null, moves: [] })
                    ],
                },
                {
                    name: "Time Gamma",
                    slots: [
                        ...teamGamma.map((id) => ({ pokemonId: id, moves: [] })),
                        ...Array(6 - teamGamma.length).fill({ pokemonId: null, moves: [] })
                    ],
                },
            ]);
        }
    }, [pokemons]);

    useEffect(() => {
        localStorage.setItem("pokemon-collection", JSON.stringify(myCollection));
    }, [myCollection]);

    const getPokemon = (id: string) => myPokemon?.find((p) => p.id === id);


    const setSlotPokemon = (teamIdx: number, slotIdx: number, pokemonId: string) => {
        setTeams((prev) => {
            const next = JSON.parse(JSON.stringify(prev)) as Team[];
            const pokemon = getPokemon(pokemonId);
            // const defaultMoves = pokemon
            //   ? pokemon.learnedMoves.slice(0, 4).map((m) => m.name)
            //   : [];
            next[teamIdx].slots[slotIdx] = { pokemonId, moves: [] };
            return next;
        });
    };

    const removeSlotPokemon = (teamIdx: number, slotIdx: number) => {
        setTeams((prev) => {
            const next = JSON.parse(JSON.stringify(prev)) as Team[];
            next[teamIdx].slots[slotIdx] = { pokemonId: null, moves: [] };
            return next;
        });
    };

    const handleTeam = (team: string) => {
        console.log("handleTeam", team, teamSelected);
        if (teamSelected !== team) {
            console.log("Selected team", team);
            sounds.clickPagination.play();
            setTeamSelected(team as "teamAlpha" | "teamBeta" | "teamGamma");
        }
    }

    const handleEditTeam = () => {
        const teamidx = teamsIdx[teamSelected as keyof typeof teamsIdx];
        console.log("Edit team", teamidx);
        setEditTeam(teams[teamidx]);
        setIsEditTeam(true);
    }

    const handleSubmitEditTeam = () => {
        console.log("Edit team", currentTeam.slots);
        handleSubmitTeam({ team: currentTeam });
        setIsEditTeam(false);
    }

    const handleCancelEditTeam = () => {
        console.log("Edit team", currentTeam.slots);

        setTeams((prev) => {
            const next = JSON.parse(JSON.stringify(prev)) as Team[];
            next[selectedTeamIdx] = editTeam || emptyTeam(currentTeam.name);
            return next;
        });
        setEditTeam(null);
        setIsEditTeam(false);
    }

    const currentTeam = teams[selectedTeamIdx];
    const selectedSlot =
        selectedSlotIdx !== null ? currentTeam.slots[selectedSlotIdx] : null;
    const selectedPokemon =
        selectedSlot?.pokemonId ? getPokemon(selectedSlot.pokemonId) : null;
    return (
        <>
            <section>
                <h2 className="font-display text-lg font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Montar Times
                </h2>
                <Tabs
                    value={String(selectedTeamIdx)}
                    onValueChange={(v) => {
                        if (!isEditTeam && !isEditMove) {
                            console.log("Selected team idx", v);
                            setSelectedTeamIdx(Number(v));
                            setSelectedSlotIdx(null);
                            handleTeam(teamsName[teams[Number(v)].name as keyof typeof teamsName]);
                        }
                    }}
                >
                    <div className="flex row items-center justify-between">

                        <TabsList className="bg-card/60 border border-border/50">
                            {teams.map((t: { name: string }, i) => (
                                <TabsTrigger key={i} value={String(i)} className="font-display text-xs tracking-wider" onClick={() => handleTeam(teamsName[t.name as keyof typeof teamsName])}>
                                    {t.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {!isEditTeam  &&
                            <Button disabled={isEditMove} size="sm" className="font-body glow-red" onClick={handleEditTeam}>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                            </Button>
                        }

                        {isEditTeam && !isEditMove && (
                            <div className="flex row gap-2">
                                <Button size="sm" className="font-body glow-red" onClick={handleCancelEditTeam}>
                                    <XSquare className="mr-2 h-4 w-4" /> cancelar
                                </Button>
                                <Button size="sm" className="font-body glow-green bg-grass hover:bg-grass/70 cursor-pointer" onClick={handleSubmitEditTeam}>
                                    <Edit className="mr-2 h-4 w-4" /> salvar
                                </Button>
                            </div>
                        )}
                    </div>

                    {teams.map((team, tIdx) => (
                        <TabsContent key={tIdx} value={String(tIdx)} className="mt-4">
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {team.slots.map((slot, sIdx) => {
                                    const poke = slot.pokemonId ? getPokemon(slot.pokemonId) : null;
                                    const isSelected = selectedSlotIdx === sIdx;
                                    return (
                                        <div
                                            key={sIdx}
                                            className={`relative rounded-xl border-2 transition-all cursor-pointer min-h-[140px] flex flex-col items-center justify-center p-2 ${isSelected
                                                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                                : poke
                                                    ? "border-border/50 bg-card hover:border-primary/40"
                                                    : "border-dashed border-border/40 bg-card/30 hover:border-primary/30"
                                                }`}
                                            onClick={() => {
                                                if (poke) {
                                                    setSelectedSlotIdx(isSelected ? null : sIdx);
                                                } else {
                                                    if (isEditTeam) {
                                                        setAddSlotIdx(sIdx);
                                                        setAddDialogOpen(true);
                                                    }
                                                }
                                            }}
                                        >
                                            {poke ? (
                                                <>
                                                    {isEditTeam && (
                                                        <button
                                                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive/80 flex items-center justify-center hover:bg-destructive z-10"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeSlotPokemon(tIdx, sIdx);
                                                                if (isSelected) setSelectedSlotIdx(null);
                                                            }}
                                                        >
                                                            <X className="w-3 h-3 text-destructive-foreground" />
                                                        </button>
                                                    )}
                                                    <img
                                                        src={poke.pokemon.img1}
                                                        alt={poke.nickname || poke.pokemon.name}
                                                        className="w-16 h-16 object-contain drop-shadow-lg"
                                                    />
                                                    <span className="font-body text-xs font-semibold mt-1">{poke.nickname || poke.pokemon.name}</span>
                                                    <div className="flex gap-0.5 mt-1">
                                                        {poke.pokemon.types.split(",").map((t) => (
                                                            <span key={t} className={`${typeColors[t]} w-2 h-2 rounded-full`} />
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                                    <Plus className="w-8 h-8" />
                                                    <span className="text-[10px] font-body">Adicionar</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Selected Pokemon Moves */}
                            {selectedPokemon && selectedSlot && selectedSlotIdx !== null && (
                               <PokemonMoveList 
                               isEditTeam={isEditTeam}
                               selectedPokemon={selectedPokemon}
                               isEditMove={isEditMove}
                               setEditMove={setIsEditMove} />
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </section>
            {/* Add Pokemon Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="bg-card border-border/50 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-display">Escolher Pokémon</DialogTitle>
                        <DialogDescription>Selecione um Pokémon da sua coleção para esse slot.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] pr-2">
                        <div className="grid grid-cols-3 gap-2">
                            {myPokemon
                                .filter((p) => myCollection.includes(p.id))
                                .map((p) => {
                                    const alreadyInTeam = currentTeam.slots.some((s) => s.pokemonId === p.id);
                                    return (
                                        <button
                                            key={p.id}
                                            disabled={alreadyInTeam}
                                            onClick={() => {
                                                if (addSlotIdx !== null) {
                                                    setSlotPokemon(selectedTeamIdx, addSlotIdx, p.id);
                                                    setAddDialogOpen(false);
                                                }
                                            }}
                                            className={`rounded-lg border p-2 flex flex-col items-center transition-all ${alreadyInTeam
                                                ? "opacity-30 cursor-not-allowed border-border/20"
                                                : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5"
                                                }`}
                                        >
                                            <img src={p.pokemon.img1} alt={p.pokemon.name} className="w-14 h-14 object-contain" />
                                            <span className="font-body text-xs font-semibold">{p.pokemon.name}</span>
                                            <div className="flex gap-0.5 mt-0.5">
                                                {p.pokemon.types.split(",").map((t) => (
                                                    <span key={t} className={`${typeColors[t]} w-1.5 h-1.5 rounded-full`} />
                                                ))}
                                            </div>
                                        </button>
                                    );
                                })}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TeamsPokemon;