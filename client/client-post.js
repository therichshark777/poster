let messageData = [];

// Функция для экранирования специальных символов в JSON
function escapeSpecialChars(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Функция для извлечения ссылок из текста
function extractLinksFromText(text) {
    const urlRegex = /https?:\/\/[^\s]+/g;
    const matches = text.match(urlRegex);
    return matches || [];
}

// Функция для извлечения данных из элемента сообщения
function extractMessageData(messageElement) {
    const sender = messageElement.querySelector('.sender-title')?.textContent.trim() || '';
    const subheader = messageElement.querySelector('.embedded-text-wrapper span')?.textContent.trim() || '';

    const messageContentNode = messageElement.querySelector('.text-content');
    let messageContent = '';
    let links = [];

    if (messageContentNode) {
        // Клонируем узел, чтобы работать с копией
        const clonedNode = messageContentNode.cloneNode(true);

        // Извлекаем все ссылки и заменяем их на [link-{id}]
        let linkIndex = 1;
        clonedNode.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                links.push(href.trim()); // Добавляем ссылку в массив
                const placeholder = `[link-${linkIndex}]`;
                link.replaceWith(document.createTextNode(placeholder)); // Заменяем ссылку на [link-{id}]
                linkIndex++;
            }
        });

        // Получаем текстовое содержимое без HTML
        messageContent = clonedNode.textContent.trim();
    }

    const senderId = messageElement.querySelector('.Avatar')?.dataset.peerId || '';

    return {
        sender: escapeSpecialChars(sender),
        subheader: escapeSpecialChars(subheader),
        messageContent: escapeSpecialChars(messageContent),
        links: links.map(escapeSpecialChars), // Экранируем ссылки
        sender_id: escapeSpecialChars(senderId),
    };
}

// Функция для обработки новых сообщений
async function handleNewMessage(messageElement) {
    const messageIdMatch = messageElement.id.match(/^message-(\d+)$/);
    const messageId = messageIdMatch ? parseInt(messageIdMatch[1], 10) : null;
    const unixTime = Math.floor(Date.now() / 1000); // Получаем текущий Unix timestamp

    const newMessageData = {
        ...extractMessageData(messageElement),
        message_id: messageId,
        time: unixTime,
    };

    messageData.push(newMessageData);

    const url = 'https://poster-p2t2.onrender.com/process';
    //const url = 'http://localhost:3000/process';

    try {
        // Отправляем POST-запрос
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([newMessageData]),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Печатаем результат в консоль
        console.log('Новое сообщение отправлено на сервер. Ответ сервера:', result);
    } catch (error) {
        console.error('Ошибка при отправке сообщения на сервер:', error);
    }
}

// Настройка MutationObserver
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && node.id.match(/^message-\d+$/)) {
                handleNewMessage(node);
            }
        });
    });
});

// Наблюдаем за изменениями в теле документа (или конкретном родительском элементе)
observer.observe(document.body, { childList: true, subtree: true });

console.log('Наблюдатель активирован. Ожидание новых сообщений...');