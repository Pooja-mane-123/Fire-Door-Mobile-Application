import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import Root from './src/routes/root';
import store from '@src/redux/store';

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* ==> Root Navigation From Where Routing Started */}
        <Root />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
