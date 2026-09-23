import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('los encabezados y acciones del taller usan instrucciones directas', async () => {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, preTransformRequests: false, hmr: false },
    appType: 'custom',
  });

  try {
    const { StudentProvider } = await server.ssrLoadModule('/src/context/StudentContext.jsx');
    const stages = [
      ['/src/components/IntroSection.jsx', 'IntroSection', /Por qué importa escribir instrucciones precisas/],
      ['/src/components/ForensicLab.jsx', 'ForensicLab', /Detecta problemas de redacción/],
      ['/src/components/VerbalModes.jsx', 'VerbalModes', /Mantén un mismo modo verbal/],
      ['/src/components/SequenceConnectors.jsx', 'SequenceConnectors', /Ordena los pasos de un procedimiento/],
    ];

    for (const [path, exportName, expectedHeading] of stages) {
      const component = (await server.ssrLoadModule(path))[exportName];
      const html = renderToStaticMarkup(
        React.createElement(StudentProvider, null, React.createElement(component)),
      );
      assert.match(html, expectedHeading, `${exportName} debe explicar la tarea con claridad`);
      assert.doesNotMatch(html, /Caza los vicios|elige uno y no lo sueltes|arriesga una respuesta/);
    }
  } finally {
    await server.close();
  }
});
