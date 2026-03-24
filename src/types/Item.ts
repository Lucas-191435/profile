export interface IItem {
    id: string; 
    pokeItemId: number; 
    pokeCategoryId: number; 
    pokeItemPocketId: number;
    name: string;
    sprite: string;
    category: string;
    description: string;
    effect: string;
    isConsumable: boolean;
    isHeldItem: boolean;
    isBattleUse: boolean;
    isDiscardable: boolean;
    isPokemonUse: boolean;
    price: number;
    regions: string;
    createdAt: string;
    updatedAt: string;
}