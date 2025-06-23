import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.8,
})

const fromTemplate = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description for the following product: {productName}"
  )

  // const wholePrompt = await prompt.format({
  //   productName: "Bicycle",
  // })
  // console.log(wholePrompt)

  // Creating a chain: connecting the model with the prompt
  const chain = prompt.pipe(model)

  const response = await chain.invoke({
    productName: "Bicycle",
  })

  console.log(response.content)
}

const fromMessages = async () => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Write a short description for the product provided by the user",
    ],
    ["human", "{productName}"],
  ])

  // Creating a chain: connecting the model with the prompt
  const chain = prompt.pipe(model)

  const response = await chain.invoke({
    productName: "Bicycle",
  })

  console.log(response.content)
}

// fromTemplate()
fromMessages()
