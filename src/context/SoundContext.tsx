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
            setIsPlayingSound(true);
            sounds.bgm.stop();
            sounds[currentSound as keyof typeof sounds]?.stop();

            const sound = sounds[e as keyof typeof sounds];

            sound.play();

            sound.once("end", () => {
                if (isBgmPlaying) {
                    sounds.bgm.play();
                }
            });

        } else {
            setIsPlayingSound(false);
            const strings = ["pokeSound1", "pokeSound2", "pokeSound3", "pokeSound4"];
            const randomSound = getRandomString(strings);
            sounds.click.play();
            setTimeout(() => {
                sounds[randomSound as keyof typeof sounds].play();
            }, 500);
        }
    }

    function getRandomString(strings: string[]): string {
        const randomIndex = Math.floor(Math.random() * strings.length);
        return strings[randomIndex];
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
        // if (!sounds.bgm.playing()) {
        //     sounds.bgm.play();
        //     // eslint-disable-next-line react-hooks/set-state-in-effect
        //     setIsBgmPlaying(true);

        // }
    }, []);

    useEffect(() => {
        if (!pathname.startsWith("/client/pokemon/") && isBgmPlaying) {
            //  sounds[currentSound as keyof typeof sounds].play();
            if (!sounds.bgm.playing()) {
                sounds.bgm.play();
            }
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsBgmPlaying(true);
        }
        if (isPlayingSound && !pathname.startsWith("/client/pokemon/")) {
            sounds[currentSound as keyof typeof sounds].stop();
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