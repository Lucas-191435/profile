const PokemonCard = ({ pokemon }: { pokemon: any }) => {
    return (
        <div className="flex justify-center flex-col items-center gap-2">
            
            <img src={pokemon.img3} alt={pokemon.name} width={200} height={200} style={{borderWidth: 1, borderColor: 'red'}}/>
            <h2 className="text-center">{pokemon.name}</h2>
        </div>
    )
}

export default PokemonCard;