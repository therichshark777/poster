const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./modules/api');
const textProcessor = require('./modules/text');
//const fileWriter = require('./modules/file');
const mongoConnect = require('./modules/database').mongoConnect;
const Post = require('./models/post');

const app = express();
const PORT = 3000;

// Включаем CORS для всех источников
app.use(cors());

// Middleware для обработки JSON
app.use(bodyParser.json());

// Endpoint для обработки POST запросов
app.post('/process', (req, res) => {
  handleRequest(req.body, res);
});

// Endpoint для обработки GET запросов
app.get('/process', (req, res) => {
  try {
    const inputArray = JSON.parse(req.query.data); // Читаем массив из query-параметра
    handleRequest(inputArray, res);
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid query parameter 'data'. Provide a valid JSON array." });
  }
});

// Функция для обработки данных
function handleRequest(inputArray, res) {
  try {
    const outputArray = api.handleInput(inputArray);

    const postArray = outputArray[0];

    const post = new Post(
      postArray['subheader'],
      postArray['messageContent'],
      postArray['links'],
      postArray['sender'],
      postArray['message_id'],
      postArray['sender_id'],
      postArray['time'],
    );

    post.save().then(result => {
      console.log('Added to db');
    });

    // const outputArray = processedInput.map((item) => {
    //   const allWords = textProcessor.processText(item.text).join(' ');
    //   return { ...item, all_words: allWords };
    // });

    //fileWriter.appendToFile('output.txt', outputArray);

    res.json({ success: true, data: outputArray });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

// Запускаем сервер
mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
