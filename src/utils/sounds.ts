import { Howl, Howler } from "howler";
// volume global (opcional)
Howler.volume(1.0);

export const sounds = {
  click: new Howl({
    src: ["/sounds/poke_plink.mp3"],
    volume: 0.5
  }),

  clickSideBar: new Howl({
    src: ["/sounds/sidebar-click.mp3"],
    volume: 0.5
  }),

  clickPagination: new Howl({
    src: ["/sounds/click-pagination.mp3"],
    volume: 0.5
  }),

  bgm: new Howl({
    src: ["/sounds/background.mp3"],
    loop: true,
    volume: 0.2 // 
  }),

   lucario: new Howl({
    src: ["/sounds/lucario-sound.mp3"],
    volume: 0.2 // 
  }),

   squirtle: new Howl({
    src: ["/sounds/epic-sax-guy-plays-for-57-minutes.mp3"],
    volume: 0.4 // 
  }),

   pikachu: new Howl({
    src: ["/sounds/pikachu.mp3"],
    volume: 0.2 // 
  }),

  pokeSound1: new Howl({
    src: ["/sounds/poke-sound-1.mp3"],
    volume: 0.2 // 
  }),
  pokeSound2: new Howl({
    src: ["/sounds/poke-sound-2.mp3"],
    volume: 0.2 // 
  }),
  pokeSound3: new Howl({
    src: ["/sounds/poke-sound-3.mp3"],
    volume: 0.2 // 
  }),
  pokeSound4: new Howl({
    src: ["/sounds/poke-sound-4.mp3"],
    volume: 0.2 // 
  }),
};