const fs = require('fs');
const path = require('path');

const licenseKey = 'ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImEwODE3YzBkLTNmNzYtNDJjYS1hZDE5LTllYmMyYzVmMWI5ZSIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjQxCn0=.jDVYl8D2frZn/DKgp33IHvycOBynlH7eg3YIyIo4TFkrIsKibx4k5SKn0UGtuM6pUwB+ZaG+v/qxpM20xJN8PNfFqZAd5oX6ZnRHVjGWrSy/8lRcq+6WwmuHDNwRU22lnRi/lQ==';

const outputPath = path.join(__dirname, 'src', 'devextreme-license.ts');
const contents = `export const licenseKey = '${licenseKey}';\n`;

try {
  fs.writeFileSync(outputPath, contents, 'utf8');
  console.log(`Licencia de DevExtreme registrada en ${outputPath}`);
} catch (err) {
  console.error(`Error al registrar la licencia de DevExtreme: ${err.message}`);
  process.exit(1);
}
