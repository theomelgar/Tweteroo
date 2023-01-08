import express from "express"
import cors from "cors"

const PORT = 5000

const app = express()
app.use(cors())
app.use(express.json())

let users = []
let tweets = []

app.post("/sign-up", (req, res) => {
    const user = req.body
    if (!user || !user.username || !user.avatar || typeof user.username != "string" || typeof user.avatar != "string") return res.status(400).send("Todos os campos são obrigatórios!")
    users.push(user)
    res.status(201).send("OK")
})

app.post("/tweets", (req, res) => {
    if (!req.body?.username && !req.headers.user) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    if (!req.body?.tweet) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    const { tweet } = req.body;

    const username = req.headers.user ? req.headers.user : req.body.username;

    if (typeof username !== "string" || typeof tweet !== "string") {
        return res.sendStatus(400);
    }

    if (!users.find(user => user.username === username)) {
        return res.status(401).send("UNAUTHORIZED");
    }

    const newTweet = { username, tweet };
    tweets.push(newTweet);
    return res.status(201).send("OK");
})

app.get("/tweets", (req, res) => {
    if (typeof req.query.page === "string") {
        if (req.query.page <= 0 || isNaN(req.query.page)) {
            return res.status(400).send("Informe uma página válida!");
        }
        const page = req.query.page
        const tweetsMax = 10
        const start = tweetsMax * page
        const lastTenTweets = tweets.slice(start - tweetsMax, start);
        const lastTweets = lastTenTweets.map(tweet => {
            const user = users.find(user => user.username === tweet.username);
            return { ...tweet, avatar: user.avatar };
        });
        return res.status(200).send(lastTweets);
    }
    const lastTenTweets = tweets.slice(-10);
    const lastTweets = lastTenTweets.map(tweet => {
        const user = users.find(user => user.username === tweet.username);
        return { ...tweet, avatar: user.avatar };
    });
    return res.status(200).send(lastTweets);
})

app.get('/tweets/:username', (req, res) => {
    const { username } = req.params;
    const userTweets = tweets.filter(tweet => tweet.username === username);
    const tweetsAvatar = userTweets.map(tweet => {
        const user = users.find(user => user.username === tweet.username);
        return { ...tweet, avatar: user.avatar };
    });
    return res.send(tweetsAvatar);
})

app.listen(PORT, () => {
    console.log("Servidor Online na porta " + PORT)
})