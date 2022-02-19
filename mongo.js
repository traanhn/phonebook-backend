const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://sa:${password}@cluster0.ehbrh.mongodb.net/phonebook-app?retryWrites=true`

console.log(url)

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB', result)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length > 3){
  person.save().then(() => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else
{
  console.log('Phonebook:')
  Person
    .find({})
    .then(persons => {
    	  persons.forEach(person => {
    		  console.log(person.name, person.number)
    		})
    	  mongoose.connection.close()
    })
}


