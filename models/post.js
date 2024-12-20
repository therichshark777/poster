require('dotenv').config();
const getDb = require('../modules/database').getDb;
const database = 'posts';

class Post {
    constructor(
        subheader,
        content,
        links,
        sender,
        message_id,
        sender_id,
        time,
    )
    {
        this.subheader = subheader;
        this.content = content;
        this.links = links;
        this.sender = sender;
        this.message_id = message_id;
        this.sender_id = sender_id;
        this.time = time;
    }

    save(){
        const db = getDb();
        return db.collection(database).insertOne(this)
        .then((result) => {
            return result;
        })
        .catch(err => {
            console.log(err);
        });
    }
}

module.exports = Post;