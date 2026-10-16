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
            <a
                href="https://github.com/Lucas-191435"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="size-10 shrink-0 flex items-center justify-center bg-white rounded-md cursor-pointer"
                data-tour="btn-github"
            >
                <Image
                    src={github}
                    alt="GitHub"
                    width={24}
                    height={24}
                    className="size-6 shrink-0"
                />
            </a>
            <a
                href="https://www.linkedin.com/in/lucas-fer-san/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="size-10 shrink-0 flex items-center justify-center bg-white rounded-md cursor-pointer"
                data-tour="btn-linkedin"
            >
                <Image
                    src={linkedin}
                    alt="LinkedIn"
                    width={24}
                    height={24}
                    className="size-6 shrink-0"
                />
            </a>
        </>
    );
};

export default SocialLinks;