import { Button } from "../ui/button";
import { Pause, Play, File} from "lucide-react";
import { useSoundContext } from "@/context/SoundContext";
import Image from "next/image";
import linkedin from "@/assets/sociallinks/linkedin.svg";
import github from "@/assets/sociallinks/github.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
const SocialLinks = () => {
    const { isBgmPlaying, toggleBgm } = useSoundContext();

    return (
        <>
            <div className="bg-white m-2 p-1 rounded-sm cursor-pointer">
                <a href="https://github.com/Lucas-191435"
                    target="_blank" rel="noopener noreferrer">
                    <Image
                        src={github}
                        alt="GitHub"
                        width={24}
                        height={24}
                    />
                </a>
            </div>
            <div className="bg-white m-2 p-1 rounded-sm cursor-pointer">
                <a href="https://www.linkedin.com/in/lucas-fer-san/"
                    target="_blank" rel="noopener noreferrer">
                    <Image
                        src={linkedin}
                        alt="LinkedIn"
                        width={24}
                        height={24}
                    />
                </a>
            </div>
        </>
    );
};

export default SocialLinks;