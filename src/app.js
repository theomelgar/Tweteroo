import express from "express"

const PORT = 5000

const app = express()
app.use(express.json())

let users = []
let tweets = []

app.post("/sign-up", (req, res) => {
    const user = req.body
    users.push(user)
    res.status(201).send("OK")
})

app.post("/tweets", (req, res) => {
    const buscaUser = users.find(item => item.username == req.body.username)
    if (buscaUser) {
        tweets.push(req.body)
        res.status(201).send("OK")
    }
    res.status(401).send("UNAUTHORIZED")

})

app.listen(PORT, () => {
    console.log("Servidor Online na porta " + PORT)
})