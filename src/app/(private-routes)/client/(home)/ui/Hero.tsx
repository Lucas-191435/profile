import Image from "next/image";
import mascotImage from "@/assets/images/hero-pokedex.png";

const Hero = () => {
    return (
        <section className="relative rounded-2xl overflow-hidden w-full h-64 lg:h-80 object-cover glow-red-strong">
            <Image
                src={mascotImage}
                alt="Pokédex"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 w-full h-64 lg:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent flex items-center">
                <div className="p-8 lg:p-12 max-w-lg space-y-4">
                    <h1 className="text-4xl font-bold">Welcome to the Pokemon App</h1>
                    <p className="text-lg mt-2">Explore the world of Pokemon and discover your favorite creatures!</p>
                </div>
            </div>
        </section>
    );
};

export default Hero;