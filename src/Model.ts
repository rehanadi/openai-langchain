import { ChatOpenAI } from "@langchain/openai"

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.8,
  maxTokens: 700,
  // verbose: true,
})

const main = async () => {
  // 1. invoke
  // const response1 = await model.invoke("Give me 4 good books to read")
  // console.log(response1.content)

  // 2. batch
  // const response2 = await model.batch(["Hello", "Give me 4 good books to read"])
  // console.log(response2)

  // 3. stream
  // const response3 = await model.stream("Give me 4 good books to read")
  // for await (const chunk of response3) {
  //   console.log(chunk.content)
  // }
}

main()
