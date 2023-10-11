import express, { Request, Response } from 'express'

import { buildSchema } from 'graphql'
import { courses } from './courses'
import { graphqlHTTP } from 'express-graphql'

const app = express()
app.use(express.json())


const schema = buildSchema(`
    type Course {
        id: ID!,
        title: String!,
        views: Int
    }

    type Query {
        getCourse: [Course]
    }
`)

const root = {
    getCourse(){
        return courses
    }
}


app.get('/', (req: Request, res: Response) => {
    res.json(courses)
})

app.use('/graphQl',graphqlHTTP({
    schema,
    rootValue:root,
    graphiql:true
}))

app.listen(8080, () => {
    console.log('Server listen on port 8080')
})
