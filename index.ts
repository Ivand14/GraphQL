import express, { Request, Response } from 'express'

import { buildSchema } from 'graphql'
import { courses } from './courses'
import { graphqlHTTP } from 'express-graphql'

const app = express()
app.use(express.json())


const schema = buildSchema(`
    type Course {
        id: ID!,
        title: String,
        views: Int
    }

    input CourseInput {
        id: ID !,
        title: String,
        views: Int
    }

    type Query {
        getCourse(page: Int, limit: Int): [Course]
        getCourseById(id:ID!): Course
    }

    type Alert{
        message: String
    }

    type Mutation {
        addCourse(input: CourseInput): Course
        updateCourse(input: CourseInput): Course
        deleteCourse(input: CourseInput): Alert
    }
`)

const root = {
    getCourse({page,limit}:{page:number;limit:number}){
        if(page != undefined){
            return courses.slice(page * limit , (page + 1) * limit)
        }
        return courses
    },
    getCourseById({id}:{id:string}){
        console.log(id)
        return courses.find((course)=> id === course.id)
    },
    //*Mutacion =>
    addCourse({input}:{input:any}){
        const {title,views}:{title:string,views:number} = input
        const id:string = String(courses.length + 1)
        const course = {id,title,views}
        courses.push(course)
        return course
    },
    updateCourse({input}:{input:any}){
        const {id,title,views}:{id:string;title:string,views:number} = input
        const indexCourse = courses.findIndex(course => id === course.id)
        const courseToUpdate = courses[indexCourse];
        const newCourse = Object.assign(courseToUpdate,{title,views})
        courses[indexCourse] = newCourse;
        
        return newCourse;
        
    },
    deleteCourse({input}:{input:any}){
        const{id}:{id:string} = input
        const findCourse = courses.findIndex(course => course.id === id)
        console.log("index",findCourse)
        courses.splice(findCourse,1)
        return{
            message : `El curso ${id} fue eliminado`
        }
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

app.listen(5173, () => {
    console.log('Server listen on port 5173')
})
