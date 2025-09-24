import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SELECTS_API, LANCAMENTO_API } from '../config'; // <-- usando config.js

export default function LancamentoForm() {
  const [tipo, setTipo] = useState('');
  const [plano, setPlano] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataVenc, setDataVenc] = useState(new Date());
  const [valor, setValor] = useState('');
  const [forma, setForma] = useState('');
  const [banco, setBanco] = useState(1);
  const [cartao, setCartao] = useState(1);
  const [dataRecPag, setDataRecPag] = useState(null);

  const [showDataVenc, setShowDataVenc] = useState(false);
  const [showDataRecPag, setShowDataRecPag] = useState(false);

  const [tipos, setTipos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [formas, setFormas] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const descricaoRef = useRef(null);
  const valorRef = useRef(null);

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const handleValorChange = (input) => {
    let cleaned = input.replace(/\D/g, '');
    if (!cleaned) return setValor('');
    let number = parseFloat(cleaned) / 100;
    const formatted = number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    setValor(formatted);
  };

  const handleDescricaoChange = (text) => {
    setDescricao(text.replace(/^\s+/g, ''));
  };

  const getValorAPI = () => {
    return valor.replace(/\s|R\$|\./g, '').replace(',', '.');
  };

  useEffect(() => {
    const fetchSelects = async () => {
      try {
        const response = await fetch(SELECTS_API); // ✅ usando config
        const data = await response.json();

        setTipos(data.tipos || []);
        setPlanos(data.planos || []);
        setFormas(data.formas || []);
        setBancos(data.bancos || []);
        setCartoes(data.cartoes || []);

        setBanco(1);
        setCartao(1);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados da API.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelects();
  }, []);

  const handleSave = async () => {
    if (!tipo || !plano || !descricao || !valor || !forma || !banco || !cartao || !dataVenc) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      id_cad_tipo: tipo,
      id_cad_plano: plano,
      desc_lanc: descricao,
      data_venc: formatDate(dataVenc),
      valor_lanc: getValorAPI(),
      id_cad_forma: forma,
      id_cad_banco: banco,
      id_cad_cartao: cartao,
      data_rec_pag: dataRecPag ? formatDate(dataRecPag) : null,
    };

    try {
      const response = await fetch(LANCAMENTO_API, { // ✅ usando config
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', result.message);
        handleReset();
      } else {
        Alert.alert('Erro', result.message || 'Ocorreu um erro ao salvar.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar à API.');
      console.error(error);
    }
  };

  const handleReset = () => {
    setTipo('');
    setPlano('');
    setDescricao('');
    setDataVenc(new Date());
    setValor('');
    setForma('');
    setBanco(1);
    setCartao(1);
    setDataRecPag(null);
  };

  if (loading) {
    return (
      <LinearGradient colors={['#8A2BE2', '#6A0DAD']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  let labelForma = 'Forma';
  let labelDataRecPag = 'Data';
  let labelDescricao = 'Descrição';
  let labelValor = 'Valor';

  if (tipo) {
    const tipoSelecionado = tipos.find(t => t.id === tipo)?.nome.toLowerCase();
    const isRecebimento = tipoSelecionado === 'recebimento';
    labelForma = isRecebimento ? 'Forma de recebimento' : 'Forma de pagamento';
    labelDataRecPag = isRecebimento ? 'Data de recebimento' : 'Data de pagamento';
    labelDescricao = isRecebimento ? 'Descrição do recebimento' : 'Descrição do pagamento';
    labelValor = isRecebimento ? 'Valor do recebimento' : 'Valor do pagamento';
  }

  return (
    <LinearGradient colors={['#8A2BE2', '#6A0DAD']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          {/* --- CAMPOS --- */}
          {/* O RESTO DO JSX ESTÁ IGUAL AO SEU, APENAS REMOVIDO PARA BREVIDADE */}
          {/* Não foi necessário mudar nada nos campos */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  formContainer: {
    backgroundColor: '#9b4dca',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
  label: { fontWeight: '600', color: '#333', marginBottom: 5, fontSize: 16 },
  asterisk: { color: '#ff6b6b' },
  input: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: '#6d28d9',
    height: 50,
  },
  inputText: { padding: 12, fontSize: 16, color: '#000', height: 50 },
  pickerContainer: {
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: '#6d28d9',
    height: 50,
    justifyContent: 'center',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btnReset: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginRight: 5,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#aaa',
  },
  btnSave: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  footer: { marginBottom: 15, alignItems: 'flex-start' },
  footerText: { color: '#333', fontSize: 16, fontWeight: '600' },
});
