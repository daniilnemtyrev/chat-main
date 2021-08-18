import React, { useContext, useEffect, useState } from 'react';
import * as uuid from 'uuid';
import io from 'socket.io-client';
import {
  Container,
  Content,
  Card,
  MyMessage,
  OtherMessage,
  Send,
} from '../styles/chat';
import { Message, Payload } from '../interfaces/IChat';
import { Context } from '..';
import { Button } from '../styles/UI/Button';
import { Input } from '../styles/UI/Input';

const socket = io('ws://localhost:4000');

const Chat: React.FC = () => {
  const [title] = useState('2ch');
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const { store } = useContext(Context);

  useEffect(() => {
    function receivedMessage(message: Payload) {
      const newMessage: Message = {
        id: uuid.v4(),
        name: message.name,
        text: message.text,
      };

      setMessages([...messages, newMessage]);
    }

    socket.on('msgToClient', (message: Payload) => {
      receivedMessage(message);
    });
  }, [messages, name, text]);

  function validateInput() {
    return text.length > 0;
  }

  function sendMessage() {
    if (validateInput()) {
      const message: Payload = {
        name: store.user.email,
        text,
      };

      socket.emit('msgToServer', message);
      setText('');
    }
  }

  return (
    <Container>
      <Content>
        <h1>{title}</h1>
        <Button onClick={() => store.logout()}>Выйти</Button>
        <h4>{store.user.email}</h4>
        <Card>
          <ul>
            {messages.map(message => {
              if (message.name === store.user.email) {
                return (
                  <MyMessage key={message.id}>
                    <p>{message.text}</p>
                  </MyMessage>
                );
              }

              return (
                <OtherMessage key={message.id}>
                  <span>{message.name}</span>
                  <p>{message.text}</p>
                </OtherMessage>
              );
            })}
          </ul>
        </Card>
        <Send>
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter message..."
          />
          <Button type="button" onClick={() => sendMessage()}>
            Send
          </Button>
        </Send>
      </Content>
    </Container>
  );
};

export default Chat;
