const fs = require('fs');
const path = require('path');

module.exports = {
  appendToFile: (fileName, data) => {
    const filePath = path.join(__dirname, '..', fileName);

    // Преобразуем объект в строку JSON и добавляем новую строку
    const line = `${JSON.stringify(data)}\n`;

    // Дописываем строку в конец файла
    fs.appendFileSync(filePath, line, 'utf-8');
    console.log(`Данные добавлены в файл: ${filePath}`);
  },
};
