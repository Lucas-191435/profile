import { Button } from "../ui/button";
import { Pause, Play } from "lucide-react";
import { useSoundContext } from "@/context/SoundContext";

const ControlSound = () => {
    const { isBgmPlaying, toggleBgm } = useSoundContext();

    return (
        <Button variant="outline" className="size-10 shrink-0 p-0 has-[>svg]:px-0" onClick={toggleBgm} data-tour="btn-sound" aria-label={isBgmPlaying ? "Pausar música" : "Tocar música"}>
            {isBgmPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
        </Button>
    );
};

export default ControlSound;