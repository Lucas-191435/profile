const PokemonCard = ({ pokemon }: { pokemon: any }) => {
    return (
        <div className="flex justify-center flex-col">
            
            <img src={pokemon.img2} alt={pokemon.name} />
            <h2 className="text-center">{pokemon.name}</h2>
        </div>
    )
}

export default PokemonCard;