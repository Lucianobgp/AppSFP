import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, Animated, Keyboard, Image, TouchableWithoutFeedback 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import logo from '../assets/logo.png';
import { LOGIN_API } from '../config'; // ✅ usa config.js

export default function Login({ navigation, setEmailUsuario }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const containerAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(-100)).current;
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const topAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(topAnim, { toValue: 40, duration: 800, useNativeDriver: true }),
      Animated.timing(logoAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.timing(emailAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(passwordAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(containerAnim, { toValue: -220, duration: 300, useNativeDriver: true }).start();
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(containerAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (email === '' || password === '') {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('action', 'login');
      formData.append('email', email);
      formData.append('senha', password);

      const response = await fetch(LOGIN_API, { // ✅ usando config.js
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = await response.json();

      if (response.ok && data.status === 'ok') {
        setSuccessMessage(data.message || 'Login efetuado!');
        if (setEmailUsuario) setEmailUsuario(email);

        setTimeout(() => {
          setSuccessMessage('');
          navigation.replace('HomeDrawer');
        }, 1500);

      } else {
        Alert.alert('Erro', data.message || 'Falha ao fazer login');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#6a0dad', '#9b30ff']} style={styles.background}>
        <Animated.View style={[styles.container, { transform: [{ translateY: containerAnim }] }]}>
          <Animated.View style={[styles.top, { transform: [{ translateY: topAnim }] }]}>
            <Text style={styles.subtitle}>Sistema Financeiro Pessoal</Text>
            <Animated.View style={{ transform:[{translateY:logoAnim}] }}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </Animated.View>
            <Text style={styles.title}>Bem-vindo</Text>
          </Animated.View>

          <Animated.View style={styles.middle}>
            <Animated.View style={{ opacity: emailAnim, width: '100%' }}>
              <TextInput
                style={styles.input} placeholder="Email" placeholderTextColor="#fff"
                keyboardType="email-address" autoCapitalize="none"
                value={email} onChangeText={setEmail}
              />
            </Animated.View>

            <Animated.View style={{ opacity: passwordAnim, width: '100%' }}>
              <TextInput
                style={styles.input} placeholder="Senha" placeholderTextColor="#fff"
                secureTextEntry value={password} onChangeText={setPassword}
              />
            </Animated.View>

            <Animated.View style={{ opacity: buttonAnim, width: '100%' }}>
              <TouchableOpacity onPress={handleLogin} disabled={loading}>
                <LinearGradient colors={['#9b30ff','#6a0dad']} style={styles.button}>
                  <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          <View style={styles.bottom}>
            <Text style={styles.footer}>Desenvolvido por Luciano Faria e Bruno Gomes</Text>
          </View>

          {successMessage !== '' && (
            <View style={[styles.toast, { bottom: 120 }]}>
              <Text style={styles.toastText}>{successMessage}</Text>
            </View>
          )}
        </Animated.View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: { flex:1 },
  container: { flex:1, justifyContent:'space-between', padding:20 },
  top: { alignItems:'center' },
  middle: { width:'100%', alignItems:'center' },
  bottom: { alignItems:'center' },
  logo: { width:220, height:220, borderRadius:110, overflow:'hidden', marginBottom:15 },
  title: { fontSize:34, fontWeight:'bold', marginTop:10, color:'#fff', textAlign:'center' },
  subtitle: { fontSize:28, marginBottom:25, color:'#fff', textAlign:'center' },
  input: {
    width:'100%', padding:15, marginBottom:20, borderRadius:12, 
    backgroundColor:'rgba(255,255,255,0.2)', fontSize:18, color:'#fff',
    borderWidth:0
  },
  button: { padding:18, borderRadius:12, alignItems:'center', marginTop:10 },
  buttonText: { color:'#fff', fontSize:20, fontWeight:'bold' },
  footer: { fontSize:16, color:'#fff', textAlign:'center', marginBottom:20 },
  toast: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 1000,
  },
  toastText: { 
    color: '#fff', 
    fontSize: 18,
    textAlign: 'center', 
    fontWeight:'600' 
  },
});
