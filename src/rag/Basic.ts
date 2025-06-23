import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { Document } from "@langchain/core/documents"
import { ChatPromptTemplate } from "@langchain/core/prompts"

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.7,
})

const myData = [
  "My name is John.",
  "My name is Bob.",
  "My favorite food is pizza.",
  "My favorite food is pasta.",
]

const question = "What are my favorite foods?"

const main = async () => {
  // Store the data
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings())
  await vectorStore.addDocuments(
    myData.map((content) => new Document({ pageContent: content }))
  )

  // Create data retriever
  const retriever = vectorStore.asRetriever({
    k: 2, // Number of documents to retrieve
  })

  // Get relevant documents
  const docs = await retriever._getRelevantDocuments(question)
  const resultDocs = docs.map((doc) => doc.pageContent)

  // Build template
  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the users question based on the following context: {context}",
    ],
    ["user", "{input}"],
  ])

  // Create a chain
  const chain = template.pipe(model)

  const response = await chain.invoke({
    input: question,
    context: resultDocs,
  })

  console.log(response.content)
  // Your favorite foods are pizza and pasta.
}

main()
