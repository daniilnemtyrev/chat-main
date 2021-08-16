import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import LoginForm from './components/loginForm';
import { Context } from './index';

const App: React.FC = () => {
  const { store } = useContext(Context);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAut();
    }
  }, []);

  if (!store.IsAuth) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>
        {store.IsAuth
          ? `Пользователь авторизован ${store.user.email} `
          : `Авторизуйтесь!`}
      </h1>
      <button onClick={() => store.logout()}>Выйти</button>
    </div>
  );
};

export default observer(App);
