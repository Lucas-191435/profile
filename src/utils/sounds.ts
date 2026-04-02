import { Howl, Howler } from "howler";
// volume global (opcional)
Howler.volume(1.0);

export const sounds = {
  click: new Howl({
    src: ["/sounds/poke_plink.mp3"],
    volume: 0.5
  }),

  bgm: new Howl({
    src: ["/sounds/background.mp3"],
    loop: true,
    volume: 0.2 // 🔥 música baixa
  })
};