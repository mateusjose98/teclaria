import { test, expect } from '@playwright/test';

test('imagens, voz, teclas físicas, pausa e desbloqueio', async ({ page }) => {
  await page.addInitScript(() => {
    const spoken: string[] = [];
    Object.assign(window, { spoken });
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: (u: SpeechSynthesisUtterance) => spoken.push(u.text),
        cancel: () => {},
        getVoices: () => [],
      },
    });
    localStorage.setItem(
      'teclaria.progress.v1',
      JSON.stringify({ nome: 'Ana', licoesConcluidas: ['0-1', '0-2', '0-3'] }),
    );
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Continuar treinamento' }).click();
  await expect(page.getByRole('img', { name: 'Imagem da tecla Enter' })).toBeVisible();
  await expect(page.getByRole('img', { name: /Localização de Enter/ })).toBeVisible();
  await page.screenshot({ path: '.tools/screenshots/tecla-enter.png', fullPage: true });
  await page.getByRole('button', { name: 'Ouvir pronúncia de Enter' }).click();
  expect(await page.evaluate(() => (window as unknown as { spoken: string[] }).spoken)).toContain(
    'Ênter',
  );
  const input = page.getByLabel('Digite aqui');
  await input.press('Escape');
  await expect(input).not.toBeFocused();
  for (const key of ['Enter', 'Space', 'Enter', 'Space']) await input.press(key);
  await expect(page.getByRole('heading', { name: 'Você mandou muito bem!' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar jornada' }).click();
  await expect(page.getByRole('img', { name: 'Imagem da tecla Backspace' })).toBeVisible();
  await page.screenshot({ path: '.tools/screenshots/tecla-backspace.png', fullPage: true });
  await input.press('Enter');
  await expect(page.getByText('Quase! Tente novamente.')).toBeVisible();
  await input.press('Backspace');
  await expect(page.getByRole('img', { name: 'Imagem da tecla Tab' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: '.tools/screenshots/tecla-tab-mobile.png', fullPage: true });
  for (const key of ['Tab', 'Control', 'Backspace', 'Tab', 'Control']) await input.press(key);
  await page.getByRole('button', { name: 'Continuar jornada' }).click();
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('img', { name: 'Imagem da tecla Enter' })).toBeVisible();
  for (const key of ['Enter', 'Space', 'Enter', 'Backspace', 'Tab', 'Control'])
    await input.press(key);
  await page.getByRole('button', { name: 'Continuar jornada' }).click();
  await expect(page.getByRole('heading', { name: /Um número/ })).toBeVisible();
});
