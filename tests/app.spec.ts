import { test, expect, type Page } from '@playwright/test';
import { lessons } from '../src/data/lessons';
const key = 'teclaria.progress.v1';
async function createUser(page: Page) {
  await page.goto('/');
  await page.getByLabel('Olá! Como podemos chamar você?').fill('Ana');
  await page.getByRole('button', { name: 'Começar minha jornada' }).click();
  await page.getByRole('button', { name: 'Vamos começar', exact: true }).click();
}
async function exitLesson(page: Page) {
  await page.getByRole('button', { name: 'Sair da etapa', exact: true }).first().click();
  await page.getByRole('dialog').getByRole('button', { name: 'Sair da etapa' }).click();
}
async function typeCurrentLesson(page: Page) {
  while (await page.locator('.target-text').count()) {
    const text = await page.locator('.target-text').getAttribute('aria-label');
    const lines = text!.split('\n');
    for (let i = 0; i < lines.length; i++) {
      await page.getByLabel('Digite aqui').pressSequentially(lines[i], { delay: 3 });
      if (i < lines.length - 1) await page.getByLabel('Digite aqui').press('Enter');
    }
    await page.waitForTimeout(40);
  }
}
async function seed(page: Page, completed: number) {
  await page.goto('/');
  await page.evaluate(
    ({ key, completed }) => {
      const ids = Array.from({ length: 15 }, (_, i) => `${Math.floor(i / 3)}-${(i % 3) + 1}`);
      localStorage.setItem(
        key,
        JSON.stringify({
          nome: 'Ana',
          licoesConcluidas: [
            ...ids.slice(0, completed),
            ...(completed >= 3 ? ['keys-1', 'keys-2', 'keys-3'] : []),
          ],
          xp: 850,
          maiorSequencia: 12,
          conquistas: ['first'],
          configuracoes: { som: false },
          estatisticas: {
            melhorPrecisao: 98,
            melhorPpm: 25,
            totalCaracteres: 450,
            totalErros: 9,
            sessoes: 3,
          },
        }),
      );
    },
    { key, completed },
  );
  await page.reload();
}
test('onboarding, conclusão, erros, persistência, repetição e reset', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await createUser(page);
  await expect(page.getByRole('heading', { name: 'Olá, teclado!' })).toBeVisible();
  await page.getByLabel('Digite aqui').pressSequentially('x');
  await expect(page.getByText('Quase! Tente novamente.')).toBeVisible();
  await typeCurrentLesson(page);
  await expect(page.getByRole('heading', { name: 'Você mandou muito bem!' })).toBeVisible();
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  expect(saved.licoesConcluidas).toEqual(['0-1']);
  expect(saved.estatisticas.totalErros).toBe(1);
  expect(saved.xp).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: /Bem-vindo de volta, Ana/ })).toBeVisible();
  await page.getByRole('button', { name: 'Níveis', exact: true }).click();
  await expect(page.getByRole('button', { name: /ETAPA 1 Um número/ })).toBeDisabled();
  await expect(page.getByRole('button', { name: /ETAPA 1 Olá, teclado/ })).toBeEnabled();
  await page.getByRole('button', { name: 'Configurações', exact: true }).click();
  await page.getByRole('switch', { name: 'Som', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Configurações', exact: true }).click();
  await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('button', { name: 'Reiniciar progresso', exact: true }).click();
  await page.getByRole('button', { name: 'Manter meu progresso' }).click();
  await expect(page.getByRole('heading', { name: 'Um cantinho para seus ajustes' })).toBeVisible();
  await page.getByRole('button', { name: 'Reiniciar progresso', exact: true }).click();
  await page.getByRole('button', { name: 'Sim, reiniciar' }).click();
  await expect(page.getByLabel('Olá! Como podemos chamar você?')).toBeVisible();
  expect(errors).toEqual([]);
});
test('etapas da jornada, teclado acentuado e desbloqueio real do nível 1', async ({ page }) => {
  await createUser(page);
  await typeCurrentLesson(page);
  await page.getByRole('button', { name: 'Continuar jornada' }).click();
  await typeCurrentLesson(page);
  await page.getByRole('button', { name: 'Continuar jornada' }).click();
  await typeCurrentLesson(page);
  await page.getByRole('button', { name: 'Voltar ao início' }).click();
  await page.getByRole('button', { name: 'Níveis', exact: true }).click();
  await expect(page.locator('.stage')).toHaveCount(lessons.length);
  await expect(page.getByRole('button', { name: /ETAPA 1 Espaço para suas ideias/ })).toBeEnabled();
  await expect(page.getByRole('button', { name: /ETAPA 1 Um número/ })).toBeDisabled();
});
test('exercícios cabem nos desktops e layout se adapta ao celular', async ({ page }) => {
  await createUser(page);
  for (const size of [
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(size);
    expect(
      await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      })),
    ).toEqual(size);
    await expect(page.locator('.keyboard')).toBeInViewport();
  }
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.screenshot({ path: '.tools/screenshots/exercicio.png', fullPage: true });
  await exitLesson(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.screenshot({ path: '.tools/screenshots/home-1366.png', fullPage: true });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screenshot({ path: '.tools/screenshots/home-1920.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
test('bolhas selecionam alvo, pontuam, pausam e terminam', async ({ page }) => {
  await seed(page, 9);
  await page.getByRole('button', { name: 'Continuar treinamento' }).click();
  await page.getByRole('button', { name: 'Começar jogo' }).click();
  await expect(page.locator('.bubble').first()).toBeVisible();
  await page.screenshot({ path: '.tools/screenshots/bolhas.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(768);
  const first = (await page.locator('.bubble').first().innerText()).trim();
  await page.getByLabel('Digite aqui').pressSequentially(first);
  await expect(page.getByText('10 pontos', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Respire. O jogo está pausado.' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar jogo' }).click();
  for (let n = 0; n < 80 && (await page.locator('.game-area').count()); n++) {
    const bubble = page.locator('.bubble:not(.popped)').first();
    if (await bubble.count()) {
      const word = await bubble.locator(':scope > span').innerText();
      await page.getByLabel('Digite aqui').pressSequentially(word, { delay: 5 });
    }
    await page.waitForTimeout(300);
  }
  await expect(page.getByRole('heading', { name: 'Você mandou muito bem!' })).toBeVisible();
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).licoesConcluidas, key),
  ).toContain('3-1');
});
test('modo livre bloqueado e depois disponível; frases funcionam sem rede', async ({
  page,
  context,
}) => {
  await seed(page, 14);
  await page.getByRole('button', { name: 'Níveis', exact: true }).click();
  await expect(page.getByRole('button', { name: /Modo Livre/ })).toBeDisabled();
  await page.getByRole('button', { name: /ETAPA 3 Mestre das histórias/ }).click();
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(768);
  await typeCurrentLesson(page);
  for (let stage = 0; stage < 3; stage++) {
    await page.getByRole('button', { name: 'Continuar jornada' }).click();
    await typeCurrentLesson(page);
  }
  await expect(page.getByText('Mestre do teclado', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar jornada' }).click();
  await page.getByRole('button', { name: /Frases/ }).click();
  await context.setOffline(true);
  await typeCurrentLesson(page);
  await expect(page.getByRole('heading', { name: 'Você mandou muito bem!' })).toBeVisible();
  await page.getByRole('button', { name: 'Mais uma rodada' }).click();
  await expect(page.getByRole('heading', { name: 'Pratique no seu ritmo' })).toBeVisible();
});

test('perder três vidas não libera a próxima etapa', async ({ page }) => {
  await seed(page, 9);
  await page.clock.install();
  await page.getByRole('button', { name: 'Continuar treinamento' }).click();
  await page.getByRole('button', { name: 'Começar jogo' }).click();
  await page.clock.runFor(47000);
  await expect(page.getByRole('heading', { name: 'Vamos tentar mais uma vez?' })).toBeVisible();
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  expect(saved.licoesConcluidas).toHaveLength(12);
  expect(saved.xp).toBe(850);
});

test('composição de acentos não duplica entrada e colagem é bloqueada', async ({ page }) => {
  await seed(page, 1);
  await page.getByRole('button', { name: 'Continuar treinamento' }).click();
  const input = page.getByLabel('Digite aqui');
  for (const c of [',', '.', ';', ':', '/', '?']) await input.pressSequentially(c);
  await expect(page.locator('.target-text')).toHaveAttribute('aria-label', 'á');
  await input.evaluate((element) => {
    const field = element as HTMLInputElement;
    field.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    setter.call(field, 'á');
    field.dispatchEvent(new InputEvent('input', { bubbles: true, data: 'á', isComposing: true }));
    field.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: 'á' }));
  });
  await expect(page.locator('.target-text')).toHaveAttribute('aria-label', 'é');
  const pastePrevented = await input.evaluate(
    (element) =>
      !element.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true })),
  );
  expect(pastePrevented).toBe(true);
  await expect(page.locator('.exercise-stats')).toContainText('100%');
});

test('pausa mantém foco, congela tempo e confirmação de saída suspende exercício', async ({
  page,
}) => {
  await seed(page, 6);
  await page.getByRole('button', { name: 'Continuar treinamento' }).click();
  await page.getByLabel('Digite aqui').pressSequentially('c');
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Continuar exercício' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Digite aqui')).toBeFocused();
  await page.getByRole('button', { name: 'Teclaria, início' }).click();
  await expect(page.locator('dialog[open]')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar treinando' }).click();
  await expect(page.getByRole('heading', { name: 'Uma pausa faz bem.' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar exercício' }).click();
  await page.getByLabel('Digite aqui').pressSequentially('asa');
  await expect(page.locator('.target-text')).toHaveAttribute('aria-label', 'gato');
});
