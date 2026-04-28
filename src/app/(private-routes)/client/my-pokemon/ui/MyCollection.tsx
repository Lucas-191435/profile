import { useMyPokemonContext } from "@/context/MyPokemonContext";
import { X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MyCollection = () => {
    const { pokemons, isLoading: contextLoading, error: contextError, myCollection, setMyCollection } = useMyPokemonContext();
    const myPokemon = pokemons || [];
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

    const toggleCollection = (id: string) => {
        setMyCollection((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };
    return (
        <>
            <section>
                <h2 className="font-display text-lg font-semibold mb-3 text-muted-foreground">Minha Coleção</h2>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {myPokemon.map((p) => {
                        const owned = myCollection.includes(p.id);
                        return (
                            <button
                                key={p.id}
                                onClick={() => toggleCollection(p.id)}
                                className={`relative rounded-lg border p-1 transition-all hover:scale-105 group ${owned ? "border-primary/50 bg-card" : "border-border/30 bg-card/30"
                                    }`}
                            >
                                {!owned && (
                                    <div className="absolute inset-0 bg-white/10 opacity-40 grayscale pointer-events-none rounded-lg backdrop-grayscale"
                                        style={{ filter: 'grayscale(100%)' }}
                                    />
                                )}

                                <div
                                    role="button"
                                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive flex items-center justify-center hover:bg-red-600 z-50 shadow-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRemoveDialogOpen(true);
                                    }}
                                >
                                    <X className="w-3 h-3 text-white" />
                                </div>

                                <div className={!owned ? "grayscale" : ""}>
                                    <img src={p.pokemon.img1} alt={p.pokemon.name} className="w-full aspect-square object-contain" />
                                    <span className="block text-[10px] font-body text-center truncate">
                                        {p.nickname || p.pokemon.name}
                                    </span>
                                </div>

                                {owned && (
                                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </section>
            {/* Remove Pokemon Dialog */}
            <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                <DialogContent className="bg-card border-border/50 max-w-md px-8 ">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="font-display text-center mb-2">Excluír Pokémon</DialogTitle>
                        <DialogDescription className="text-[20px] ">Você tem certeza que deseja excluir este Pokémon da sua coleção?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex !justify-around gap-2 px-4">
                        <Button
                            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md"
                            onClick={() => {
                                // Add logic to remove the selected Pokémon from the collection
                                setRemoveDialogOpen(false);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md"
                            onClick={() => {
                                // Add logic to remove the selected Pokémon from the collection
                                setRemoveDialogOpen(false);
                            }}
                        >
                            Excluír
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MyCollection;