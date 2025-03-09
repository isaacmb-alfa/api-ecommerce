import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo db.json
const filePath = path.join(__dirname, '../db.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Actualizar los SKU de los productos
data.items = data.items.map(product => {
    product.sku = uuidv4();
    return product;
});

// Guardar el archivo actualizado
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('SKU actualizados exitosamente');