import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Login from './app/Login';
import Home from './app/Home';
import Lancamento from './app/Lancamento';
import Sair from './app/Sair';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [emailUsuario, setEmailUsuario] = useState('');

  function CustomDrawerContent(props) {
    return (
      <LinearGradient colors={['#8A2BE2', '#6A0DAD']} style={{ flex: 1 }}>
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
          {/* Email do usuário centralizado */}
          {emailUsuario !== '' && (
            <View style={styles.userContainer}>
              <Ionicons name="person-circle-outline" size={50} color="#fff" />
              <Text style={styles.userEmail}>{emailUsuario}</Text>
            </View>
          )}

          {/* Separador */}
          <View style={styles.separator} />

          <DrawerItemList 
            {...props} 
            itemStyle={styles.drawerItem} 
            labelStyle={styles.drawerLabel} 
          />
        </DrawerContentScrollView>
      </LinearGradient>
    );
  }

  function AppDrawer() {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: '#6A0DAD' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={28}
              color="#fff"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          drawerActiveTintColor: '#fff',
          drawerInactiveTintColor: 'rgba(255,255,255,0.7)',
          drawerActiveBackgroundColor: 'rgba(255,255,255,0.15)',
          drawerLabelStyle: { fontSize: 18 },
          drawerStyle: {
            backgroundColor: 'transparent',
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            width: 260,
          },
        })}
      >
        <Drawer.Screen
          name="Home"
          options={{
            title: 'Início',
            drawerIcon: ({ focused, size, color }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={size + 2} color={color} />
            ),
          }}
        >
          {props => <Home {...props} />}
        </Drawer.Screen>
        <Drawer.Screen
          name="Lançamento"
          options={{
            drawerIcon: ({ focused, size, color }) => (
              <Ionicons name={focused ? 'create' : 'create-outline'} size={size + 2} color={color} />
            ),
          }}
        >
          {props => <Lancamento {...props} />}
        </Drawer.Screen>
        <Drawer.Screen
          name="Sair"
          options={{
            drawerIcon: ({ focused, size, color }) => (
              <Ionicons name={focused ? 'exit' : 'exit-outline'} size={size + 2} color={color} />
            ),
          }}
        >
          {props => <Sair {...props} setEmailUsuario={setEmailUsuario} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer theme={CustomTheme}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {props => <Login {...props} setEmailUsuario={setEmailUsuario} />}
        </Stack.Screen>
        <Stack.Screen name="HomeDrawer" component={AppDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 40,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // centraliza horizontalmente
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 40, // desce o email para o topo
  },
  userEmail: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 15, // afasta ícone do texto
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  drawerItem: {
    marginVertical: 5,
    paddingVertical: 5,
    paddingLeft: 0,
  },
  drawerLabel: {
    marginLeft: 25, // afasta o ícone do texto
    fontSize: 18,
  },
});
