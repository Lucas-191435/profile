import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Swords, GraduationCap, Sparkles } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePokeMove } from "@/services/queries/usePokeMove";
import { useState } from "react";
import { errorToast, infoToast, successToast } from "@/utils/toasts";
import { useCreatePokemon } from "@/services/queries/useMyPokemon";
import { AxiosError } from "axios";


const CapturePokemon = ({ pokemon }: { pokemon: { id: string, name: string } }) => {
    const [captureOpen, setCaptureOpen] = useState(false);
    const [nickname, setNickname] = useState("");
    const createPokemon = useCreatePokemon();

    const handleCapture = () => {
        console.log("Capturando Pokémon:", pokemon, "com apelido:", nickname);
        createPokemon.mutate({ id: pokemon.id, nickname }, {
            onSuccess: () => {
                clearAndClose();
                successToast({ description: "Pokémon capturado" });
            },
            onError: (error: AxiosError<{ success: boolean, error: string }>) => {
                clearAndClose();
                const errorMessage = error.response?.data?.error || "Erro ao capturar Pokémon";
                infoToast({ description: errorMessage });
            }
        });
    };

    const clearAndClose = () => {
        setNickname("");
        setCaptureOpen(false);
    }



    return (
        <section>
            <Dialog open={captureOpen} onOpenChange={() => {
                if (!captureOpen) {
                    setNickname("");
                }
                setCaptureOpen(!captureOpen);
            }}>
                <DialogTrigger asChild>
                    <Button size="sm" className="font-body glow-red">
                        <Sparkles className="mr-2 h-4 w-4" /> Capturar
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="font-display tracking-wide capitalize">Capturar {pokemon.name}</DialogTitle>
                        <DialogDescription className="font-body text-muted-foreground">
                            Dê um apelido ao seu novo Pokémon (opcional).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="nickname" className="font-body">Apelido</Label>
                        <Input
                            id="nickname"
                            placeholder={`Ex: ${pokemon.name}`}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="font-body"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setCaptureOpen(false)} className="font-body">Cancelar</Button>
                        <Button onClick={handleCapture} className="font-body glow-red">
                            <Sparkles className="mr-2 h-4 w-4" /> Capturar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default CapturePokemon;