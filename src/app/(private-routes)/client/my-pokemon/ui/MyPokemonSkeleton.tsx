import { Users, Shield } from "lucide-react";
import ContainerSidebar from "@/components/shared/ContainerSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const MyPokemonSkeleton = () => {
  return (
    <ContainerSidebar className="p-4 lg:p-8 space-y-6">
      {/* Title Skeleton */}
      <div className="flex items-center gap-2">
        <Users className="w-6 h-6 text-muted-foreground animate-pulse" />
        <div className="h-8 w-48 bg-muted rounded-md animate-pulse"></div>
      </div>

      {/* Collection Skeleton */}
      <section className="space-y-4">
        <div className="h-6 w-32 bg-muted rounded-md animate-pulse"></div>
        
        {/* Collection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl border border-border/50 bg-card p-3 flex flex-col items-center justify-center animate-pulse">
              <div className="w-16 h-16 bg-muted rounded-lg mb-2"></div>
              <div className="h-3 w-12 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* Teams Skeleton */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-muted-foreground animate-pulse" />
          <div className="h-5 w-32 bg-muted rounded-md animate-pulse"></div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <div className="flex space-x-1 bg-card/60 border border-border/50 rounded-lg p-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
            ))}
          </div>

          {/* Team Grid Skeleton */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="relative rounded-xl border-2 border-dashed border-border/40 bg-card/30 min-h-[140px] flex flex-col items-center justify-center p-2 animate-pulse"
              >
                <div className="w-16 h-16 bg-muted rounded-lg mb-2"></div>
                <div className="h-3 w-12 bg-muted rounded mb-1"></div>
                <div className="flex gap-0.5">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Pokemon Moves Skeleton */}
          <div className="p-4 rounded-xl border border-primary/30 bg-card/80 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                <div className="flex gap-1">
                  <div className="h-4 w-12 bg-muted rounded"></div>
                  <div className="h-4 w-12 bg-muted rounded"></div>
                </div>
              </div>
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div className="h-3 w-20 bg-muted rounded"></div>
            </div>

            {/* Moves Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-dashed border-border/30 bg-background/20 p-3 animate-pulse">
                  <div className="h-3 w-16 bg-muted rounded mb-1"></div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                    <div className="h-2 w-10 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ContainerSidebar>
  );
};

export default MyPokemonSkeleton;