import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.7,
})

const question = "What are langchain libraries?"

const main = async () => {
  // Create the loader
  const loader = new CheerioWebBaseLoader(
    "https://js.langchain.com/docs/introduction"
  )
  const docs = await loader.load()

  // Split the docs
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  })
  const splitedDocs = await splitter.splitDocuments(docs)

  // Store the data
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings())
  await vectorStore.addDocuments(splitedDocs)

  // Create data retriever
  const retriever = vectorStore.asRetriever({
    k: 2, // Number of documents to retrieve
  })

  // Get relevant documents
  const relevantDocs = await retriever._getRelevantDocuments(question)
  const resultDocs = relevantDocs.map((doc) => doc.pageContent)

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
  // LangChain libraries are open-source components that form part of the LangChain framework.
}

// main()
