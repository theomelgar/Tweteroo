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
    const {tweet} = req.body
    const username = req.headers.user ? req.body.user : req.headers.user
    const findUser = users.find(item => item.username == tweet.username)
    if (findUser) {
        if (typeof username !== 'string' || typeof tweet !== 'string') {
            return res.status(400).send("Todos os campos são obrigatórios!")
        }
        const id = tweets.length + 1
        const avatar = findUser.avatar
        const newTweet = {username, tweet}
        newTweet.avatar = avatar
        tweet.id = id
        tweets.push(newTweet)
        res.status(201).send("OK")
    }
    res.status(401).send("UNAUTHORIZED")

})

app.get("/tweets", (req, res) => {
    const page = req.query.page
    const tweetsMax = 10
    const start = tweetsMax * page
    if (page) {
        if (page == 0) return res.status(400).send("Informe uma página válida!")
        else return res.status(200).send(tweets.slice(start - tweetsMax, start).reverse())
    } else {
        return res.status(200).send(tweets.slice(-tweetsMax).reverse())
    }
})

app.get("/tweets/:USERNAME", (res, req) => {
    const filterUser = tweets.filter(tweet => tweet.username === req.params.USERNAME);
    if (!filterUser) return res.send({})
    res.status(200).send(filterUser);
})

app.listen(PORT, () => {
    console.log("Servidor Online na porta " + PORT)
})