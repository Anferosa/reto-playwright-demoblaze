import { test, expect } from '../fixtures';
import { evidenciaElemento } from '../../utils/acciones';

const HU02 = { type: 'HU', description: 'HU-02 Consulta del catálogo' };

test.describe('HU-02 Consulta del catálogo', () => {

  test('CP-R05 Filtrar productos por la categoría Monitors', {
    tag: ['@smoke', '@catalogo'],
    annotation: HU02,
  }, async ({ homePage }) => {
    await homePage.selectCategory('Monitors');

    await expect(homePage.productCards).toHaveCount(2);
    await expect(homePage.productNames).toHaveText(['Apple monitor 24', 'ASUS Full HD']);
    await evidenciaElemento(homePage.productList, 'Resultado: solo se listan los 2 monitores');
  });

  test('CP-R06 El detalle del producto muestra nombre y precio', {
    tag: ['@catalogo'],
    annotation: HU02,
  }, async ({ homePage, productPage }) => {
    await homePage.openProduct('Samsung galaxy s6');

    await expect(productPage.name).toHaveText('Samsung galaxy s6');
    await evidenciaElemento(productPage.name, 'Resultado: nombre del producto');
    await expect(productPage.price).toContainText('$360');
    await evidenciaElemento(productPage.price, 'Resultado: precio del producto');
  });
});
