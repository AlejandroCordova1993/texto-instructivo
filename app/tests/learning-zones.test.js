import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import tailwindConfig from '../tailwind.config.js';

test('la retícula de las etapas gana ancho sin ocupar toda la retícula de marca', () => {
  const stageWidth = parseFloat(tailwindConfig.theme.maxWidth?.stage ?? tailwindConfig.theme.extend.maxWidth.stage) * 16;
  const brandWidth = parseFloat(tailwindConfig.theme.extend.maxWidth.brand);
  assert.ok(stageWidth >= 1080, `la etapa todavía mide solo ${stageWidth}px`);
  assert.ok(stageWidth < brandWidth, 'la etapa no debe volver a ancho completo');
});

test('teoría y práctica quedan contenidas dentro de la retícula común de la etapa', async () => {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, preTransformRequests: false },
    appType: 'custom',
  });
  try {
    const { SectionWrapper } = await server.ssrLoadModule('/src/components/SectionWrapper.jsx');
    const { StudentProvider } = await server.ssrLoadModule('/src/context/StudentContext.jsx');
    const html = renderToStaticMarkup(
      React.createElement(StudentProvider, null,
        React.createElement(SectionWrapper, {
          id: 'intro',
          step: '01',
          title: 'El reto',
          practiceTag: 'Caso simulado',
          practiceTitle: 'Analiza una orden ambigua',
        }, React.createElement('p', null, 'Actividad de prueba')),
      ),
    );

    const stage = html.match(/^<section id="intro"[^>]*class="([^"]+)"/);
    assert.ok(stage);
    assert.match(stage[1], /px-4/);
    assert.match(html, /^<section id="intro"[^>]*><div class="mx-auto max-w-stage"><header/);
    const theory = html.match(/<section[^>]*id="teoria-intro"[^>]*class="([^"]+)"/);
    assert.ok(theory, 'la teoría existe dentro de la etapa');
    assert.match(theory[1], /w-full/);
    assert.doesNotMatch(theory[1], /max-w-/);
    assert.match(theory[1], /bg-ok-bg/);
    assert.match(theory[1], /border-t-inst-blue/);
    assert.match(html, /<p class="mb-7 max-w-reading font-serif/);
    assert.match(html, /<p class="mt-2 max-w-reading text-base leading-relaxed text-charcoal"/);
    const practiceHtml = html.slice(html.indexOf('<section aria-labelledby="intro-practice-title"'));
    const practice = practiceHtml.match(/^<section[^>]*class="([^"]+)"><header class="([^"]+)"/);
    assert.ok(practice, 'la práctica queda dentro de la columna de la etapa');
    assert.doesNotMatch(practice[1], /bg-paper-pure/);
    const activity = practiceHtml.match(/<\/header><div class="([^"]+)"><p>Actividad de prueba<\/p>/);
    assert.doesNotMatch(practice[2], /max-w-/);
    assert.match(practice[2], /border-t-active-blue/);
    assert.ok(activity, 'la actividad queda después de la cabecera');
    assert.match(activity[1], /bg-paper-pure/);
    assert.doesNotMatch(activity[1], /max-w-/);
    assert.match(html, /La práctica/);
    assert.match(html, /Caso simulado/);
    assert.doesNotMatch(html, /border-inst-red|text-inst-red[^<]*La práctica/);
  } finally {
    await server.close();
  }
});
