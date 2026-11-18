import { test, expect } from '../fixtures';
import { esperarAlerta } from '../utils/alertas';
import { evidenciaElemento } from '../../utils/acciones';

const HU01 = { type: 'HU', description: 'HU-01 Inicio de sesión' };

test.describe('HU-01 Inicio de sesión', () => {

  test('CP-R01 Login exitoso con usuario registrado', {
    tag: ['@smoke', '@login'],
    annotation: HU01,
  }, async ({ homePage, loginModal }) => {
    const usuario = process.env.DEMOBLAZE_USER;
    const clave = process.env.DEMOBLAZE_PASSWORD;
    test.skip(!usuario || !clave, 'Faltan DEMOBLAZE_USER y DEMOBLAZE_PASSWORD en el archivo .env');

    await homePage.openLogin();
    await loginModal.login(usuario!, clave!);

    await expect(homePage.welcomeUser).toContainText(usuario!);
    await evidenciaElemento(homePage.welcomeUser, 'Resultado: bienvenida con el nombre del usuario');
  });

  test('CP-R02 Login fallido con contraseña incorrecta', {
    tag: ['@login'],
    annotation: HU01,
  }, async ({ page, homePage, loginModal }) => {
    const usuario = process.env.DEMOBLAZE_USER;
    test.skip(!usuario, 'Falta DEMOBLAZE_USER en el archivo .env');

    await homePage.openLogin();
    const mensaje = await esperarAlerta(page, () => loginModal.login(usuario!, 'clave_incorrecta_123'));

    expect(mensaje).toContain('Wrong password');
    await expect(homePage.welcomeUser).toBeHidden();   // el usuario NO inició sesión
  });

  test('CP-R03 Login fallido con usuario inexistente', {
    tag: ['@login'],
    annotation: HU01,
  }, async ({ page, homePage, loginModal }) => {
    await homePage.openLogin();
    const mensaje = await esperarAlerta(page, () => loginModal.login('usuario_inexistente_qa_98765', 'cualquier_clave'));

    expect(mensaje).toContain('User does not exist');
    await expect(homePage.welcomeUser).toBeHidden();
  });

  test('CP-R04 Login fallido con campos vacíos', {
    tag: ['@login'],
    annotation: HU01,
  }, async ({ page, homePage, loginModal }) => {
    await homePage.openLogin();
    const mensaje = await esperarAlerta(page, () => loginModal.login('', ''));

    expect(mensaje).toContain('Please fill out Username and Password');
    await expect(homePage.welcomeUser).toBeHidden();
  });
});
