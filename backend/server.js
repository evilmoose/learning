const app = require("./app")
const { PORT } = require("./config")

app.listen(PORT, () => {
    console.log(`Listening... http://localhost:${PORT}`)
})