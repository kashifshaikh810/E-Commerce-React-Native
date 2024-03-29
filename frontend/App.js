import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/redux/Store';
import {DrawerNavigation} from './src/DrawerNavigation/DrawerNavigation';
import FlashMessage from 'react-native-flash-message';
import {loadUser} from './src/redux/actions/userAction';
import Icon from 'react-native-vector-icons/MaterialIcons';

Icon.loadFont();
console.ignoredYellowBox = true;
LogBox.ignoreAllLogs();

const App = props => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, [store.dispatch]);

  return (
    <Provider store={store}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <DrawerNavigation />
      <FlashMessage position={'top'} floating hideStatusBar />
    </Provider>
  );
};

export default App;
