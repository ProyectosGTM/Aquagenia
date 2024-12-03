const { exec } = require('child_process');

// Obtén la clave de licencia desde las variables de entorno
const licenseKey = process.env.DEVEXTREME_LICENSE_KEY || 'your-license-key';

if (!licenseKey) {
  console.error('Error: No se encontró la clave de licencia en las variables de entorno.');
  process.exit(1);
}

// Comando para registrar la licencia de DevExtreme
const command = `devextreme set-license ${licenseKey}`;

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error al registrar la licencia de DevExtreme: ${stderr}`);
    process.exit(1);
  } else {
    console.log(`Licencia de DevExtreme registrada exitosamente: ${stdout}`);
  }
});
