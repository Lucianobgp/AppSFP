import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, ActivityIndicator, Animated, 
  Platform, RefreshControl, FlatList, Dimensions, Easing 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DASHBOARD_API } from './config'; // ✅ usa config centralizada

const { width, height } = Dimensions.get('window');

export default function Home() {
  const [cardsData, setCardsData] = useState({ receita: 0, despesa: 0, saldo: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [anos, setAnos] = useState([]);
  const [mesesDisponiveis, setMesesDisponiveis] = useState([]);

  const fadeAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const translateAnims = [
    useRef(new Animated.Value(30)).current,
    useRef(new Animated.Value(30)).current,
    useRef(new Animated.Value(30)).current,
  ];

  const [mesOpen, setMesOpen] = useState(false);
  const [anoOpen, setAnoOpen] = useState(false);

  const animateCards = () => {
    fadeAnims.forEach((fade, index) => {
      fade.setValue(0);
      translateAnims[index].setValue(30);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 1000,
          delay: index * 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateAnims[index], {
          toValue: 0,
          duration: 1000,
          delay: index * 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const fetchData = async () => {
    if (!refreshing) setLoading(true);
    try {
      const response = await fetch(`${DASHBOARD_API}?mes=${mes}&ano=${ano}`);
      const data = await response.json();

      setCardsData({
        receita: data.receita ?? 0,
        despesa: data.despesa ?? 0,
        saldo: data.saldo ?? 0,
      });

      if (data.anos && Array.isArray(data.anos)) setAnos(data.anos);
      if (data.mesesDisponiveis && Array.isArray(data.mesesDisponiveis)) setMesesDisponiveis(data.mesesDisponiveis);

      animateCards();
    } catch (error) {
      console.warn('Erro ao buscar dados da API:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, [mes, ano]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const cards = [
    { title: 'Recebimentos', value: cardsData.receita, colors: ['#2196F3', '#6EC6FF'] },
    { title: 'Pagamentos', value: cardsData.despesa, colors: ['#F44336', '#FF7961'] },
    { title: 'Saldo', value: cardsData.saldo, colors: ['#4CAF50', '#80E27E'] },
  ];

  const mesesLabel = [
    '', 'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ];

  return (
    <LinearGradient colors={['#8A2BE2', '#6A0DAD']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: width * 0.05 }} edges={['top', 'left', 'right']}>

        {/* Selects lado a lado */}
        <View style={styles.dropdownRow}>
          <View style={{ flex: 1, marginRight: width * 0.025 }}>
            <DropDownPicker
              open={mesOpen}
              value={mes}
              items={mesesDisponiveis.map(m => ({ label: mesesLabel[m], value: m }))}
              setOpen={setMesOpen}
              setValue={setMes}
              placeholder="Mês"
              style={styles.dropdown}
              dropDownContainerStyle={{ backgroundColor: '#6A0DAD' }}
              textStyle={{ color: '#fff', textAlign: 'center', fontSize: 20 }}
              listItemLabelStyle={{ color: '#fff', fontSize: 18, textAlign: 'left' }}
              tickIconStyle={{ tintColor: '#fff' }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: width * 0.025 }}>
            <DropDownPicker
              open={anoOpen}
              value={ano}
              items={anos.map(a => ({ label: `${a}`, value: a }))}
              setOpen={setAnoOpen}
              setValue={setAno}
              placeholder="Ano"
              style={styles.dropdown}
              dropDownContainerStyle={{ backgroundColor: '#6A0DAD' }}
              textStyle={{ color: '#fff', textAlign: 'center', fontSize: 20 }}
              listItemLabelStyle={{ color: '#fff', fontSize: 18, textAlign: 'left' }}
              tickIconStyle={{ tintColor: '#fff' }}
            />
          </View>
        </View>

        {loading && <ActivityIndicator size="large" color="#fff" style={{ marginVertical: height * 0.03 }} />}

        {/* Cards animados */}
        <FlatList
          data={cards}
          keyExtractor={(_, index) => index.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
          renderItem={({ item, index }) => {
            const isSaldoNegativo = item.title === 'Saldo' && item.value < 0;
            return (
              <Animated.View
                style={{
                  opacity: fadeAnims[index],
                  transform: [{ translateY: translateAnims[index] }],
                  width: '100%',
                  alignItems: 'center',
                  marginBottom: height * 0.02,
                }}
              >
                <LinearGradient colors={item.colors} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text
                    style={[
                      styles.cardValue,
                      isSaldoNegativo && { color: '#FF4136' }
                    ]}
                  >
                    R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </LinearGradient>
              </Animated.View>
            );
          }}
          contentContainerStyle={{ paddingBottom: height * 0.02 }}
        />

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  dropdownRow: {
    flexDirection: 'row',
    marginBottom: height * 0.03,
  },
  dropdown: { 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    borderRadius: 25, 
    height: height * 0.07,
    paddingVertical: 8,
  },
  card: {
    width: '100%',
    borderRadius: 25,
    padding: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.18,
    maxHeight: height * 0.22,
  },
  cardTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: height * 0.015,
  },
  cardValue: { 
    fontSize: width * 0.09,
    fontWeight: 'bold', 
    color: '#fff', 
    textShadowColor: 'rgba(0,0,0,0.25)', 
    textShadowOffset: { width: 0, height: 1 }, 
    textShadowRadius: 2 
  },
});
