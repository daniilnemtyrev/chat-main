import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { useContext } from 'react';
import { Context } from '../index';
import { Container, Content } from '../styles/auth.module.';
import { Button } from '../styles/UI/Button';
import { ButtonNav } from '../styles/UI/ButtonNav';
import { Input } from '../styles/UI/Input';

const Auth: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { store } = useContext(Context);
  return (
    <Container>
      <Content>
        <Input
          type="text"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <ButtonNav>
          <Button onClick={() => store.login(email, password)}>Логин</Button>
          <Button onClick={() => store.registration(email, password)}>
            Регистрация
          </Button>
        </ButtonNav>
      </Content>
    </Container>
  );
};

export default observer(Auth);
