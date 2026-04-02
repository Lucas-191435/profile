import { sounds } from "@/utils/sounds";
import { Button } from "../ui/button";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

const ControlSound = () => {
    const [isPlaying, setIsPlaying] = useState(sounds.bgm.playing());

    const handleToggleSound = () => {
        console.log("Toggling sound. Currently playing?", sounds.bgm.playing());
        if (sounds.bgm.playing()) {
            sounds.bgm.pause();
            setIsPlaying(false);
        } else {
            sounds.bgm.play();
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        handleToggleSound(); // Inicia a música ao montar o componente
    }, []);

    return (
        <Button variant="outline" size="sm" className="m-2" onClick={handleToggleSound}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
    );
};

export default ControlSound;