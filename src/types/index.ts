export type User = {
  username: string
  id: string
  room: "blue" | "red"
  socketId: string
}

export type Message = {
  sender: string
  text: string
  createdAt: string
}
