import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  ListGroup,
  Button,
} from "react-bootstrap";
import { io } from "socket.io-client";
import { Message, User } from "../types";

// 1. Every time we refresh the page, we reconnect to the socket.io server
// 2. If the connection is correctly established, the server will emit to us an event called 'welcome' containing a message with the id of the connection
// 3. If we want to do something when the event happens we shall LISTEN to that event by using socket.on("welcome", () => {})
// 4. Once we are connected we would like to submit the username to the server --> we are going to EMIT an event called "setUsername", containing the username itself as payload
// 5. Server is listening for "setUsername" event, WHEN it receives that event it will send a "loggedIn" event to this client, and broadcast to all the other users another event with the updated list of users
// 6. The list of online users is updated only during "login", but what happens if a new user joins after the "login"? In this case we are not updating the list
// 7. When a new user joins server emits an event called "updateOnlineUsersList", this is supposed to update that list when a user joins or leaves
// 8. When the client wants to send a message, it needs to EMIT an event called "sendMessage", as payload it should contain: sender, text, date
// 9. Server is listening for "sendMessage" event, when it receives that it will broadcast that message to everybody but the sender by firing an event called "newMessage"
// 10. Anybody who is listening for a "newMessage" event will receive that message and can then display the content on the page

const socket = io("http://localhost:3001", { transports: ["websocket"] }); // if we don't pass this option, socket.io will try to use polling

const Home = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  useEffect(() => {
    // this code will be executed only once
    // we want to set our event listeners only once
    // therefore this is the good place for them
    socket.on("welcome", (welcomeMessage) => {
      console.log(welcomeMessage);

      socket.on("loggedIn", (onlineUsersList) => {
        console.log(onlineUsersList);
        setOnlineUsers(onlineUsersList);
        setLoggedIn(true);
      });
    });
  }, []);

  const submitUsername = () => {
    // here we will be emitting the "setUsername" event (server is already listening for that)
    socket.emit("setUsername", { username });
  };
  return (
    <Container fluid>
      <Row style={{ height: "95vh" }} className="my-3">
        <Col md={9} className="d-flex flex-column justify-content-between">
          {/* LEFT COLUMN */}
          {/* TOP AREA: USERNAME INPUT FIELD */}
          {/* {!loggedIn && ( */}
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              submitUsername();
            }}
          >
            <FormControl
              placeholder="Set your username here"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loggedIn}
            />
          </Form>
          {/* )} */}
          {/* MIDDLE AREA: CHAT HISTORY */}
          <ListGroup></ListGroup>
          {/* BOTTOM AREA: NEW MESSAGE */}
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormControl
              placeholder="Write your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form>
        </Col>
        <Col md={3}>
          {/* ONLINE USERS SECTION */}
          <div className="mb-3">Connected users:</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
