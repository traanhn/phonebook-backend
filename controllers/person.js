const personRouter = require('express').Router()
const Person = require('../models/person')



personRouter.get('/info',(request, response) => {
  Person.find({}).then( persons => {
    response.json(
      `Phonebook has info for ${persons.length} people  ${new Date()}`)
  })
})


personRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })


  Person.exists({ name: person.name },(error, result) => {
    if(result !== null){
      response.status(409).json({ error :'person already exists' })
    } else {
      person.save()
        .then(savedPerson => {
          response.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
    }
  }
  )
})


personRouter.get('/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})


personRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


personRouter.put('/:id', (request, response,next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = personRouter