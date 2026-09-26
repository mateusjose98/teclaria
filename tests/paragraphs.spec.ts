import { test, expect } from '@playwright/test';
import { lessons } from '../src/data/lessons';

test('parágrafos usam Enter, acompanham linhas e preservam progresso ao recarregar', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(
    (ids) =>
      localStorage.setItem(
        'teclaria.progress.v1',
        JSON.stringify({ nome: 'Ana', licoesConcluidas: ids, configuracoes: { som: false } }),
      ),
    lessons.filter((l) => l.nivel < 6).map((l) => l.id),
  );
  await page.reload();
  await page.getByRole('button', { name: 'Continuar treinamento' }).click();
  await expect(page.getByRole('heading', { name: 'Um parágrafo, muitas ideias' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  const input = page.getByLabel('Digite aqui');
  await input.press('Enter');
  await expect(page.getByText('Quase! Tente novamente.')).toBeVisible();
  const lines = lessons.find((l) => l.id === 'advanced-1')!.exercicios[0].split('\n');
  for (let i = 0; i < lines.length; i++) {
    await expect(page.getByText(`Linha ${i + 1} de 5 · ↵ significa Enter`)).toBeVisible();
    await input.pressSequentially(lines[i]);
    if (i < lines.length - 1) await input.press('Enter');
  }
  await expect(page.getByRole('heading', { name: 'Você mandou muito bem!' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Continuar treinamento' }).click();
  await expect(page.getByRole('heading', { name: 'Detalhes que fazem diferença' })).toBeVisible();
});
