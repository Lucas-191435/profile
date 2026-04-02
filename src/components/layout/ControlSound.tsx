import { Button } from "../ui/button";
import { Pause, Play } from "lucide-react";
import { useSoundContext } from "@/context/SoundContext";

const ControlSound = () => {
    const { isBgmPlaying, toggleBgm } = useSoundContext();

    return (
        <Button variant="outline" size="sm" className="m-2" onClick={toggleBgm}>
            {isBgmPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
    );
};

export default ControlSound;