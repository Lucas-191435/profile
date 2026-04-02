'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { sounds } from "@/utils/sounds";
import { usePathname } from "next/navigation";

// Define the shape of the context
interface SoundContextType {
    currentSound: string;
    setCurrentSound: React.Dispatch<React.SetStateAction<string>>;
    isPlayingSound: boolean;
    isBgmPlaying: boolean;
    handleSoundChange: (e: string) => void;
    toggleBgm: () => void;

}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();
    const [currentSound, setCurrentSound] = useState<string>("");
    const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
    const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);

    const handleSoundChange = (e: string) => {
        setCurrentSound(e);
        if (sounds[e as keyof typeof sounds]) {

            const sound = sounds[e as keyof typeof sounds];

            // para qualquer áudio atual
            sounds[currentSound as keyof typeof sounds]?.stop();
            sounds[e as keyof typeof sounds].play();

            sounds.bgm.pause();

            sound.play();

            sound.once("end", () => {
                sounds.bgm.play();
            });

            setCurrentSound(e);
        } else {
            setIsPlayingSound(false);
            sounds.click.play();
        }
    }

    const toggleBgm = () => {
        if (sounds.bgm.playing()) {
            sounds.bgm.pause();
            setIsBgmPlaying(false);
        } else {
            sounds.bgm.play();
            setIsBgmPlaying(true);
        }
    };

    useEffect(() => {
        console.log("Pathname changed:", pathname);
        if (!sounds.bgm.playing() && pathname.startsWith("/client/pokemon/") && isBgmPlaying) {
             sounds[currentSound as keyof typeof sounds].play();
            sounds.bgm.play();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsBgmPlaying(true);
        }
    }, [pathname]);


    return (
        <SoundContext.Provider value={{
            currentSound,
            setCurrentSound,
            isPlayingSound,
            isBgmPlaying,
            handleSoundChange,
            toggleBgm
        }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSoundContext = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error("useSoundContext must be used within a SoundProvider");
    }
    return context;
};