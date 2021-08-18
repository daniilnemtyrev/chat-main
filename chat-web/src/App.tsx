import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { Context } from './index';
import Auth from './pages/Auth';
import Chat from './pages/Chat';

const App: React.FC = () => {
  const { store } = useContext(Context);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAut();
    }
  }, []);

  if (!store.IsAuth) {
    return <Auth />;
  }

  return <div>{store.IsAuth ? <Chat /> : `Авторизуйтесь!`}</div>;
};

export default observer(App);
