import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, Platform} from 'react-native';
import styles from './HeaderStyles';
import {Dialog, Avatar} from '@rneui/themed';

// icons
import MenuIcon from 'react-native-vector-icons/Feather';
import BackIcon from 'react-native-vector-icons/Ionicons';
import DashboardIcon from 'react-native-vector-icons/MaterialIcons';
import OrderIcon from 'react-native-vector-icons/AntDesign';
import ProfileIcon from 'react-native-vector-icons/FontAwesome5';
import CartIcon from 'react-native-vector-icons/FontAwesome';
import LogOutIcon from 'react-native-vector-icons/MaterialIcons';
import tw from 'tailwind-react-native-classnames';
import {useDispatch, useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import {
  getAdminUsers,
  getShippingDetails,
  logOut,
} from '../../../redux/actions/userAction';
import {getCartItem} from '../../../redux/actions/cartAction';
import ModalLoader from '../ModalLoader/ModalLoader';
import {getAdminOrders, getMyOrders} from '../../../redux/actions/ordersAction';
import {getAdminProducts} from '../../../redux/actions/productAction';

const Header = props => {
  const [visible, setVisible] = useState(false);
  const [routeName, setRouteName] = useState('');
  const {loading, isAuthenticated, user} = useSelector(
    state => state.userRegister,
  );
  const dispatch = useDispatch();
  const {cartItems} = useSelector(state => state.cart);
  const route = useRoute();

  const openDrawer = () => {
    props.navigation.toggleDrawer();
  };

  const openProfileDrawer = () => {
    dispatch(getAdminOrders());
    dispatch(getAdminUsers());
    dispatch(getAdminProducts());
    dispatch(getMyOrders());
    dispatch(getCartItem());
    dispatch(getShippingDetails());
    setVisible(!visible);
  };

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const logOutUser = () => {
    props.navigation.navigate('SignIn');
    dispatch(logOut());
  };

  const data = [
    {
      title: 'Dashboard',
      styles: tw`text-sm text-gray-400 font-bold`,
      icon: <DashboardIcon name="dashboard" size={25} color="#b3b3b3" />,
      onPress: () => {
        dispatch(getAdminProducts());
        dispatch(getAdminOrders());
        dispatch(getAdminUsers());
        props.navigation.navigate('Dashboard');
        setVisible(false);
      },
    },
    {
      title: 'Orders',
      styles: tw`text-sm text-gray-400 font-bold`,
      icon: <OrderIcon name="profile" size={25} color="#b3b3b3" />,
      onPress: () => {
        props.navigation.navigate('Orders');
        setVisible(false);
      },
    },
    {
      title: 'Profile',
      styles: tw`text-sm text-gray-400 font-bold`,
      icon: <ProfileIcon name="user" size={25} color="#b3b3b3" />,
      onPress: () => {
        dispatch(getCartItem());
        props.navigation.navigate('Profile');
        setVisible(false);
      },
    },
    {
      title: 'Cart',
      styles: tw`text-sm text-gray-400 font-bold`,
      icon: <CartIcon name="shopping-cart" size={25} color={'tomato'} />,
      onPress: () => {
        dispatch(getShippingDetails());
        props.navigation.navigate('Cart');
        setVisible(false);
      },
    },
    {
      title: 'Logout',
      styles: tw`text-sm text-gray-400 font-bold`,
      icon: <LogOutIcon name="logout" size={25} color="#b3b3b3" />,
      onPress: () => logOutUser(),
    },
    {
      title: 'Close',
      styles: tw`text-sm text-gray-400 font-bold`,
      icon: <OrderIcon name="closecircle" size={25} color="#b3b3b3" />,
      onPress: () => setVisible(false),
    },
  ];

  useEffect(() => {
    dispatch(getCartItem());

    if (isAuthenticated === false) {
      props.navigation.navigate('SignIn');
      setVisible(false);
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    setRouteName(route.name);
  }, [route, props.navigation]);

  const renderIcon = () => {
    if (
      routeName === 'Home' ||
      routeName === 'Products' ||
      routeName === 'Search' ||
      routeName === 'Profile' ||
      routeName === 'Cart' ||
      routeName === 'Contact' ||
      routeName === 'About' ||
      routeName === 'SignIn' ||
      routeName === 'SignUp'
    ) {
      return <MenuIcon name="menu" size={25} onPress={() => openDrawer()} />;
    } else {
      return (
        <BackIcon
          name="arrow-back"
          size={25}
          onPress={() =>
            props.navigation.navigate(
              props?.route?.params?.isMyRoute ? 'Home' : props.backRouteName,
            )
          }
        />
      );
    }
  };

  const renderModal = () => {
    if (props.loading || loading) {
      return (
        <ModalLoader
          {...props}
          isVisible={props.loading ? props.loading : loading}
        />
      );
    }
  };

  return (
    <View
      style={[styles.container, Platform.OS === 'ios' && styles.paddingTop]}>
      <View style={styles.menu}>{renderIcon()}</View>

      <Image source={require('../../images/logo.png')} style={styles.img} />

      {user !== null && (
        <View style={styles.avatar}>
          <TouchableOpacity onPress={() => openProfileDrawer()}>
            <Avatar size={45} rounded source={{uri: user?.avatar?.url}} />
          </TouchableOpacity>
        </View>
      )}

      {user === null && (
        <View style={styles.avatar}>
          <TouchableOpacity onPress={() => props.navigation.navigate('SignIn')}>
            <Text>SignIn</Text>
          </TouchableOpacity>
        </View>
      )}

      <Dialog
        isVisible={visible}
        animationType="fade"
        overlayStyle={[
          styles.dialog,
          user?.role === 'admin' && Platform.OS === 'ios' && styles.marginTop,
        ]}
        onBackdropPress={toggleDialog}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            style={styles.touchableOpacity}>
            <View style={styles.mapContent}>
              <View style={styles.iconsContainer}>
                <View
                  style={
                    user?.role !== 'admin' && item.title === 'Dashboard'
                      ? ''
                      : styles.titleContainer
                  }>
                  <Text style={styles.titleText}>
                    {user?.role !== 'admin' && item.title === 'Dashboard'
                      ? ''
                      : item?.title}{' '}
                    {item?.title === 'Cart' &&
                      `(${cartItems && cartItems?.length})`}
                  </Text>
                </View>
                <View
                  style={
                    user?.role !== 'admin' && item.title === 'Dashboard'
                      ? ''
                      : item?.title !== 'Profile' && styles.icons
                  }>
                  {user?.role !== 'admin' && item.title === 'Dashboard'
                    ? ''
                    : item?.title === 'Profile'
                    ? null
                    : item?.icon}
                  {item?.title === 'Profile' && (
                    <Image
                      source={{uri: user?.avatar?.url}}
                      style={{width: 50, height: 50, borderRadius: 25}}
                    />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Dialog>

      {renderModal()}
    </View>
  );
};

export default Header;
