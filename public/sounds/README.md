# Sons

Os sete sons já funcionam sem downloads: `src/services/sound.ts` os sintetiza com Web Audio (osciladores de seno e envelopes curtos). Não há arquivos de áudio vazios sendo reproduzidos.

Esta pasta é reservada para futuros arquivos `correct.ogg`, `error.ogg`, `complete.ogg`, `achievement.ogg`, `record.ogg`, `pop.ogg` e `streak.ogg`. Para usá-los, substitua a síntese dentro do serviço e construa URLs com `import.meta.env.BASE_URL + 'sounds/nome.ogg'`. Preserve a preferência global, o tratamento de falhas de reprodução e o fallback sintetizado. Não dispare áudio diretamente dos componentes.
