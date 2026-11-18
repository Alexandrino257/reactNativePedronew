import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

export default function App() {
  const [saldo, setSaldo] = useState(1000.0);
  const [valorOperacao, setValorOperacao] = useState('');
  const [extrato, setExtrato] = useState([]);

  const formatarMoeda = (val) => {
    return 'R$ ' + val.toFixed(2).replace('.', ',');
  };

  const obterValorValido = () => {
    Keyboard.dismiss();
    const limpo = valorOperacao.replace(',', '.').trim();
    const val = parseFloat(limpo);

    if (limpo === '' || isNaN(val) || val <= 0) {
      Alert.alert('Valor Inválido', 'Insira uma quantia monetária positiva maior que R$ 0,00.');
      return null;
    }
    return val;
  };

  const realizarDeposito = () => {
    const valor = obterValorValido();
    if (valor === null) return;

    const novoSaldo = saldo + valor;
    setSaldo(novoSaldo);
    setExtrato((prev) => [
      { id: Date.now(), tipo: 'Depósito', valor, data: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4),
    ]);
    setValorOperacao('');
    Alert.alert('Sucesso', `Depósito de ${formatarMoeda(valor)} realizado com sucesso!`);
  };

  const realizarSaque = () => {
    const valor = obterValorValido();
    if (valor === null) return;

    if (valor > saldo) {
      Alert.alert('Saldo Insuficiente', `Operação negada! Seu saldo atual é de ${formatarMoeda(saldo)}.`);
      return;
    }

    const novoSaldo = saldo - valor;
    setSaldo(novoSaldo);
    setExtrato((prev) => [
      { id: Date.now(), tipo: 'Saque', valor, data: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4),
    ]);
    setValorOperacao('');
    Alert.alert('Sucesso', `Saque de ${formatarMoeda(valor)} concluído!`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollArea} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>CONTA DIGITAL</Text>
            </View>

            <Text style={styles.title}>Simulador Bancário</Text>

            <View style={styles.saldoCard}>
              <Text style={styles.saldoLabel}>SALDO EM CONTA</Text>
              <Text style={styles.saldoValor}>{formatarMoeda(saldo)}</Text>
            </View>

            <Text style={styles.label}>Valor da Transação (R$)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 150,00"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={valorOperacao}
              onChangeText={setValorOperacao}
            />

            <View style={styles.btnRow}>
              <Pressable
                style={({ pressed }) => [styles.btnAcao, styles.btnDeposito, pressed && styles.btnPressed]}
                onPress={realizarDeposito}
              >
                <Text style={styles.btnAcaoText}>Depositar</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.btnAcao, styles.btnSaque, pressed && styles.btnPressed]}
                onPress={realizarSaque}
              >
                <Text style={styles.btnAcaoText}>Sacar</Text>
              </Pressable>
            </View>

            {extrato.length > 0 && (
              <View style={styles.extratoContainer}>
                <Text style={styles.extratoTitle}>Últimas Transações</Text>
                {extrato.map((t) => (
                  <View key={t.id} style={styles.extratoItem}>
                    <Text style={t.tipo === 'Depósito' ? styles.extratoDep : styles.extratoSaq}>
                      {t.tipo === 'Depósito' ? '+ ' : '- '}{formatarMoeda(t.valor)}
                    </Text>
                    <Text style={styles.extratoHora}>{t.tipo} às {t.data}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B' },
  scrollArea: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  card: {
    backgroundColor: '#1C2541',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#3A506B',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#064E3B',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  badgeText: { color: '#34D399', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#F8FAFC', marginBottom: 18 },
  saldoCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#10B981',
    alignItems: 'center',
    marginBottom: 20,
  },
  saldoLabel: { fontSize: 11, fontWeight: '700', color: '#34D399', letterSpacing: 1 },
  saldoValor: { fontSize: 32, fontWeight: '900', color: '#F8FAFC', marginTop: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#CBD5E1', marginBottom: 8 },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: '#F8FAFC',
    marginBottom: 18,
  },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  btnAcao: { flex: 0.48, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnDeposito: { backgroundColor: '#10B981' },
  btnSaque: { backgroundColor: '#F59E0B' },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnAcaoText: { color: '#0B132B', fontSize: 15, fontWeight: '800' },
  extratoContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 14 },
  extratoTitle: { fontSize: 13, fontWeight: '700', color: '#CBD5E1', marginBottom: 10 },
  extratoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1E293B',
  },
  extratoDep: { color: '#34D399', fontWeight: '700', fontSize: 14 },
  extratoSaq: { color: '#F87171', fontWeight: '700', fontSize: 14 },
  extratoHora: { color: '#64748B', fontSize: 12 },
});
