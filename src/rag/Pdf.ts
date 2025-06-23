import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.7,
})

const question = "What themes does Gone with the Wind explore?"

const main = async () => {
  // Create the loader
  const loader = new PDFLoader("public/documents/books.pdf", {
    splitPages: false,
  })
  const docs = await loader.load()

  // Split the docs
  const splitter = new RecursiveCharacterTextSplitter({
    separators: [`. \n`],
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
  // "Gone with the Wind" explores themes of race, class, and gender.
}

main()
