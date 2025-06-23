import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
  StructuredOutputParser,
} from "@langchain/core/output_parsers"

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.7,
})

const stringParser = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description for the following product: {productName}"
  )

  const parser = new StringOutputParser()

  const chain = prompt.pipe(model).pipe(parser)

  const response = await chain.invoke({
    productName: "Bicycle",
  })

  console.log(response)
  // The bicycle is a versatile and eco-friendly mode of transportation that combines functionality with the joy of outdoor exploration.
}

const commaSeparatedParser = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(
    `Provide the first 5 ingredients, separated by commas, for: {word} {instructions}`
  )

  const parser = new CommaSeparatedListOutputParser()

  const chain = prompt.pipe(model).pipe(parser)

  const response = await chain.invoke({
    word: "bread",
    instructions: parser.getFormatInstructions(),
  })

  console.log(response)
  // [ 'flour', 'water', 'yeast', 'salt', 'sugar' ]
}

const structuredParser = async () => {
  const templatePrompt = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase.
    Formatting instructions: {formatInstructions}
    Phrase: {phrase}
  `)

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the person",
    likes: "what the person likes",
  })

  const chain = templatePrompt.pipe(model).pipe(outputParser)

  const result = await chain.invoke({
    phrase: "John likes Pineapple pizza",
    formatInstructions: outputParser.getFormatInstructions(),
  })

  console.log(result)
  // { name: 'John', likes: 'Pineapple pizza' }
}

// stringParser()
// commaSeparatedParser()
// structuredParser()
