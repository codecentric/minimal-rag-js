import { run } from "@backroad/backroad"
import { initializeRagChain } from "./ragChain"

function startChatUI(askRAG: Function) {
  run(async (br) => {
    const messages = br.getOrDefault("messages", [
      { by: "ai", content: "Wie kann ich dir helfen?" },
    ])
    br.write({ body: `# Chatte mit deinen Dokumenten \n---` })

    messages.forEach((message) => {
      br.chatMessage({ by: message.by }).write({ body: message.content })
    })

    const input = br.chatInput({ id: "input" })
    if (input) {
      const response = await askRAG(input)
      br.setValue("messages", [
        ...messages,
        { by: "human", content: input },
        { by: "ai", content: response },
      ])
    }
  })
}

const main = async () => {
  const chain = await initializeRagChain("./data")
  startChatUI((input: string) => chain.invoke(input))
}
main()
