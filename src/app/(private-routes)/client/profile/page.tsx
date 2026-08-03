/* eslint-disable @next/next/no-img-element */
'use client';
import ContainerSidebar from "@/components/shared/ContainerSidebar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Skull, Sparkles, Pencil, Check, UserCircle2, Shield } from "lucide-react";
import { toast } from "sonner";
import { useMyPokemon } from "@/services/queries/useMyPokemon";
import { useUser, useUpdateUser } from "@/services/queries/useUser";
import { useAuth } from "@/hooks/useAuth";
import { TRAINERS } from "@/utils/trainers";




interface TeamSlot { pokemonId: string; moves: string[] }
interface Team { name: string; slots: TeamSlot[] }

const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const typeColors: Record<string, string> = {
  fire: "bg-red-500", water: "bg-blue-500", grass: "bg-green-500", electric: "bg-yellow-500",
  normal: "bg-gray-400", poison: "bg-purple-500", ground: "bg-amber-600", fairy: "bg-pink-400",
  bug: "bg-lime-500", psychic: "bg-pink-500", flying: "bg-indigo-300", fighting: "bg-orange-700",
  rock: "bg-amber-800", ghost: "bg-purple-800", ice: "bg-cyan-300", dragon: "bg-indigo-700",
  dark: "bg-gray-700", steel: "bg-gray-500",
};

const ClientHomePage = () => {
  const { data: pokemonList } = useMyPokemon({ enabled: true });
  const { data: authUser } = useAuth();
  const userId = authUser?.id ?? "";
  const { data: user } = useUser({ userId, enabled: !!userId });
  const updateUserMutation = useUpdateUser(userId);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: "", description: "" });
  const [avatarOpen, setAvatarOpen] = useState(false);

  const [teams, setTeams] = useState<Team[]>([]);

  const avatarId = user?.avatar || TRAINERS[0].id;
  const trainer = TRAINERS.find((t) => t.id === avatarId) ?? TRAINERS[0];
  const stats = user?.stats;
  const winRate = stats ? Math.round(stats.winRate * 100) : 0;

  const startEdit = () => {
    setDraft({ name: user?.name ?? "", description: user?.description ?? "" });
    setEditing(true);
  };

  const saveEdit = () => {
    updateUserMutation.mutate({
      name: draft.name.trim().slice(0, 50) || "Treinador",
      description: draft.description.trim().slice(0, 240),
      avatar: avatarId,
    });
    setEditing(false);
  };

  const pickAvatar = (id: string) => {
    updateUserMutation.mutate({
      name: user?.name ?? "",
      description: user?.description ?? "",
      avatar: id,
    });
    setAvatarOpen(false);
  };

  useEffect(() => {
        if (pokemonList) {
            const teamApha = pokemonList?.filter((p) => p.teamAlpha === true).map((p) => p.id) || [];
            const teamBeta = pokemonList?.filter((p) => p.teamBeta === true).map((p) => p.id) || [];
            const teamGamma = pokemonList?.filter((p) => p.teamGamma === true).map((p) => p.id) || [];
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
    }, [pokemonList]);

  console.log("Teams", teams);
  return (
    <ContainerSidebar className="flex justify-center items-center px-1">
      <div className="space-y-6 w-full max-w-8xl">
        <h1 className="font-display text-2xl font-bold tracking-wide flex items-center gap-2">
          <UserCircle2 className="w-6 h-6 text-primary" /> Meu Perfil
        </h1>

        {/* Identity card */}
        <Card className="border-primary/30 bg-card/80 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent pointer-events-none" />
          <CardContent className="">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <button
                onClick={() => setAvatarOpen(true)}
                className="relative group shrink-0"
                aria-label="Trocar avatar"
              >
                <Avatar className="w-24 h-24 border-4 border-card ring-2 ring-primary/50 bg-background">
                  <AvatarImage src={trainer.url} alt={trainer.name} className="object-contain" />
                  <AvatarFallback className="font-display">{trainer.name[0]}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg group-hover:scale-110 transition-transform">
                  <Pencil className="w-3 h-3" />
                </span>
              </button>

              <div className="flex-1 min-w-0 space-y-2">
                {editing ? (
                  <div className="space-y-2">
                    <Input
                      value={draft.name}
                      maxLength={50}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="font-display text-lg"
                      placeholder="Nome do treinador"
                    />
                    <Textarea
                      value={draft.description}
                      maxLength={240}
                      onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                      placeholder="Descrição"
                      className="font-body text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-2xl font-bold tracking-wide">{user?.name || "Treinador"}</h2>
                    <p className="font-body text-sm text-muted-foreground whitespace-pre-wrap">
                      {user?.description || "Sem descrição."}
                    </p>
                  </>
                )}
              </div>

              <div className="shrink-0">
                {editing ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
                    <Button size="sm" onClick={saveEdit}>
                      <Check className="w-4 h-4 mr-1" /> Salvar
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={startEdit}>
                    <Pencil className="w-4 h-4 mr-1" /> Editar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-display text-muted-foreground tracking-wider">Vitórias</p>
                  <p className="font-display text-2xl font-bold">{stats?.wins ?? 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Skull className="w-8 h-8 text-destructive" />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-display text-muted-foreground tracking-wider">Derrotas</p>
                  <p className="font-display text-2xl font-bold">{stats?.losses ?? 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <p className="text-[10px] uppercase font-display text-muted-foreground tracking-wider">Pokémon</p>
                <p className="font-display text-2xl font-bold">{stats?.pokemonLength ?? pokemonList?.length ?? 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-[10px] uppercase font-display text-muted-foreground tracking-wider">Win Rate</p>
                <p className="font-display text-2xl font-bold">{winRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Minhas Equipes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:px-4 px-1">
            {teams.length === 0 && (
              <p className="text-sm text-muted-foreground font-body">Nenhuma equipe montada ainda.</p>
            )}
            {teams.map((team, i) => {
              const filled = team.slots.filter((s) => s.pokemonId !== null);
              return (
                <div key={i} className="rounded-lg border border-border/50 bg-background/40 p-2 px-">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-sm font-semibold tracking-wide">{team.name}</h3>
                    <Badge variant="outline" className="text-[16px]">{filled.length}/6</Badge>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {team.slots.map((slot, sIdx) => {
                      const poke = slot.pokemonId ? pokemonList?.find((p) => p.id === slot.pokemonId) : null;
                      return (
                        <div
                          key={sIdx}
                          className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 ${poke ? "border-border/50 bg-card" : "border-dashed border-border/30 bg-card/20"
                            }`}
                        >
                          {poke ? (
                            <>
                              <img src={spriteUrl(poke.pokemon.pokeId)} alt={poke.pokemon.name} className="min-w-full min-h-3/4 object-contain" />
                              <span className="text-[9px] font-body truncate w-full text-center">{poke.pokemon.name}</span>
                              <div className="flex gap-0.5">
                                {JSON.parse(poke.pokemon.types).map((t:string) => (
                                  <span key={t} className={`${typeColors[t]} w-1.5 h-1.5 rounded-full`} />
                                ))}
                              </div>
                            </>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">—</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Avatar picker */}
        <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
          <DialogContent className="bg-card border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">Escolha seu avatar</DialogTitle>
              <DialogDescription>Selecione um treinador da franquia Pokémon.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-2">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {TRAINERS.map((t) => {
                  const active = t.id === avatarId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => pickAvatar(t.id)}
                      className={`rounded-xl border-2 p-2 flex flex-col items-center gap-1 transition-all hover:scale-105 ${active ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-border/40 bg-background/40"
                        }`}
                    >
                      <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-background to-muted rounded-lg overflow-hidden">
                        <img src={t.url} alt={t.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <span className="font-display text-xs tracking-wide">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </ContainerSidebar>
  );
}

export default ClientHomePage;