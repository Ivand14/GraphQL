import {ApolloServer} from 'apollo-server'
import { courses } from './courses';
import {makeExecutableSchema} from '@graphql-tools/schema'

const typesDef = `
    type Course {
        id: ID,
        title: String,
        views: Int
    }

    input CourseInput {
        id: ID ,
        title: String,
        views: Int
    }

    type Query {
        getCourse(page: Int, limit: Int): [Course]
    }


    type Mutation {
        addCourse(input: CourseInput): Course
    }

`;



const schema = makeExecutableSchema({
    typeDefs:typesDef,
    resolvers:{
        Query:{
            getCourse(obj,{page,limit}){
                if(page !== undefined){
                    return courses.slice(page * limit, (page + 1) * limit)
                }
                return courses
            }
        },
        Mutation:{
            addCourse(obj,{input}:{input:any}){
                let {id,title,views}:{id:string;title:string;views:number} = input
                id = String(courses.length + 1)
                const course = {id,title,views}
                courses.push(course)
                return course
            }
        }
    }
}) 

const server = new ApolloServer({
    schema:schema
})

server.listen().then(({url})=>{
    console.log(`Servidor iniciado en ${url}`)
})