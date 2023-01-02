import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

//to use the dotenv variables
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

//instance of openai
const openai = new OpenAIApi(configuration)

//initialize express
const app = express()

//middleware
app.use(cors()) //cors allows cross origin requests to allow server to be called from the frontend
app.use(express.json()) //allows passing json from frontend to backend

//dummy root route
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex',
    })
})

//
app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0, //how likely it is to be creative. 0 is most deterministic
            max_tokens: 3000, 
            top_p: 1,
            frequency_penalty: 0.5,  //how likely it is to say a similar thing twice
            presence_penalty: 0,
        })
        //send request back to frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({error})
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'))