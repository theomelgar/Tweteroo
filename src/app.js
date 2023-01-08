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
    const newTweet = req.body
    const findUser = users.find(item => item.username == newTweet.username)
    if (findUser) {
        if (!newTweet || !newTweet.username || !newTweet.tweet || typeof newTweet.tweet != "string") return res.status(400).send("Todos os campos são obrigatórios!")
        const id = tweets.length + 1
        const avatar = findUser.avatar
        newTweet.avatar = avatar
        newTweet.id = id
        tweets.push(newTweet)
        res.status(201).send("OK")
    }
    res.status(401).send("UNAUTHORIZED")

})

app.get("/tweets", (req, res) => {
    res.send(tweets.slice(-10).reverse())
})

app.get("/tweets/:USERNAME", (res, req) => {
    const filterUser = tweets.filter( tweet => tweet.username === parseInt(req.params.USERNAME));
    if (!filterUser) return res.send({})
    res.status(200).send(filterUser);
})

app.listen(PORT, () => {
    console.log("Servidor Online na porta " + PORT)
})