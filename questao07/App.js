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
  const [produto, setProduto] = useState('');
  const [preco, setPreco] = useState('');
  const [desconto, setDesconto] = useState('');
  const [resumo, setResumo] = useState(null);

  const calcularDesconto = () => {
    Keyboard.dismiss();

    if (!produto.trim()) {
      Alert.alert('Produto Obrigatório', 'Informe a descrição do produto.');
      return;
    }

    const p = parseFloat(preco.replace(',', '.').trim());
    const d = parseFloat(desconto.replace(',', '.').trim());

    if (isNaN(p) || p < 0 || preco.trim() === '') {
      Alert.alert('Preço Inválido', 'Informe um preço válido e não negativo (R$).');
      return;
    }

    if (isNaN(d) || d < 0 || d > 100 || desconto.trim() === '') {
      Alert.alert('Desconto Inválido', 'O percentual de desconto precisa estar entre 0% e 100%.');
      return;
    }

    const economia = p * (d / 100);
    const precoFinal = p - economia;

    setResumo({
      produto: produto.trim(),
      precoOriginal: p.toFixed(2),
      percentual: d.toFixed(1),
      economia: economia.toFixed(2),
      precoFinal: precoFinal.toFixed(2),
    });
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
              <Text style={styles.badgeText}>E-COMMERCE</Text>
            </View>

            <Text style={styles.title}>Cálculo de Desconto</Text>
            <Text style={styles.subtitle}>
              Estime com precisão a economia e o valor líquido a pagar com base na taxa percentual.
            </Text>

            <Text style={styles.label}>Nome do Produto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Teclado Mecânico RGB"
              placeholderTextColor="#64748B"
              value={produto}
              onChangeText={setProduto}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Preço Original (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 250,00"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  value={preco}
                  onChangeText={setPreco}
                />
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Desconto (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0 a 100"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  value={desconto}
                  onChangeText={setDesconto}
                />
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.btnAplicar, pressed && styles.btnPressed]}
              onPress={calcularDesconto}
            >
              <Text style={styles.btnAplicarText}>Aplicar Desconto</Text>
            </Pressable>

            {resumo && (
              <View style={styles.resumoCard}>
                <Text style={styles.resumoProduto}>{resumo.produto}</Text>
                <Text style={styles.resumoSub}>Desconto concedido: {resumo.percentual}%</Text>

                <View style={styles.divider} />

                <View style={styles.resumoItem}>
                  <Text style={styles.resumoLabel}>Preço de Tabela:</Text>
                  <Text style={styles.resumoValorOriginal}>R$ {resumo.precoOriginal}</Text>
                </View>

                <View style={styles.resumoItem}>
                  <Text style={styles.resumoLabel}>Economia:</Text>
                  <Text style={styles.resumoEconomia}>- R$ {resumo.economia}</Text>
                </View>

                <View style={styles.resumoItemFinal}>
                  <Text style={styles.resumoFinalLabel}>Preço Final:</Text>
                  <Text style={styles.resumoFinalValor}>R$ {resumo.precoFinal}</Text>
                </View>
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
  title: { fontSize: 22, fontWeight: '800', color: '#F8FAFC', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#94A3B8', marginBottom: 20, lineHeight: 19 },
  label: { fontSize: 13, fontWeight: '600', color: '#CBD5E1', marginBottom: 6 },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#F8FAFC',
    marginBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { width: '48%' },
  btnAplicar: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnAplicarText: { color: '#022C22', fontSize: 16, fontWeight: '800' },
  resumoCard: {
    marginTop: 22,
    backgroundColor: '#064E3B20',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#10B981',
    padding: 18,
  },
  resumoProduto: { fontSize: 17, fontWeight: '700', color: '#F8FAFC' },
  resumoSub: { fontSize: 12, color: '#34D399', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 12 },
  resumoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  resumoLabel: { fontSize: 13, color: '#94A3B8' },
  resumoValorOriginal: { fontSize: 14, color: '#CBD5E1', textDecorationLine: 'line-through' },
  resumoEconomia: { fontSize: 14, color: '#34D399', fontWeight: '700' },
  resumoItemFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  resumoFinalLabel: { fontSize: 14, fontWeight: '700', color: '#F8FAFC' },
  resumoFinalValor: { fontSize: 24, fontWeight: '900', color: '#10B981' },
});
