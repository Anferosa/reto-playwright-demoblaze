import { Page, Dialog, expect, test } from '@playwright/test';

// Demoblaze avisa muchos resultados con alert() del navegador ("Product added", "Wrong password.").
// Playwright cierra esas alertas solo, así que aquí las escuchamos para poder VERIFICAR su texto.
// Las alertas nativas no salen en las capturas de pantalla: por eso el mensaje se adjunta al reporte como texto.
//
// Uso:  const mensaje = await esperarAlerta(page, () => loginModal.login('a', 'b'));
export async function esperarAlerta(page: Page, accion: () => Promise<void>): Promise<string> {
  let mensaje = '';
  const manejador = async (dialogo: Dialog) => {
    mensaje = dialogo.message();
    await dialogo.accept();
  };

  page.on('dialog', manejador);   // se registra ANTES de la acción que provoca la alerta
  try {
    await accion();
    await expect.poll(() => mensaje, { message: 'Se esperaba una alerta del sitio' }).not.toBe('');
  } finally {
    page.off('dialog', manejador);
  }

  await test.step(`Alerta del sitio: "${mensaje}"`, async () => {
    await test.info().attach(`Alerta - ${mensaje}`, { body: mensaje, contentType: 'text/plain' });
  });
  return mensaje;
}
