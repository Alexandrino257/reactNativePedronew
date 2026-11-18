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
  const [temperatura, setTemperatura] = useState('');
  const [direcao, setDirecao] = useState('C_PARA_F'); // 'C_PARA_F' ou 'F_PARA_C'
  const [conversao, setConversao] = useState(null);

  const executarConversao = () => {
    Keyboard.dismiss();
    const tempFormatada = temperatura.replace(',', '.').trim();
    const tempNum = parseFloat(tempFormatada);

    if (tempFormatada === '' || isNaN(tempNum)) {
      Alert.alert('Entrada Inválida', 'Informe uma temperatura numérica válida (positiva ou negativa).');
      return;
    }

    if (direcao === 'C_PARA_F') {
      const fahrenheit = (tempNum * 9) / 5 + 32;
      setConversao({
        origem: `${tempNum} °C`,
        destino: `${fahrenheit.toFixed(2)} °F`,
        formula: 'F = (C × 9/5) + 32',
      });
    } else {
      const celsius = ((tempNum - 32) * 5) / 9;
      setConversao({
        origem: `${tempNum} °F`,
        destino: `${celsius.toFixed(2)} °C`,
        formula: 'C = (F - 32) × 5/9',
      });
    }
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
              <Text style={styles.badgeText}>METEOROLOGIA</Text>
            </View>

            <Text style={styles.title}>Conversor Térmico</Text>
            <Text style={styles.subtitle}>
              Converta grandezas termométricas entre as escalas Celsius e Fahrenheit.
            </Text>

            <Text style={styles.label}>Selecione o Sentido da Conversão</Text>
            <View style={styles.tabContainer}>
              <Pressable
                style={[styles.tab, direcao === 'C_PARA_F' && styles.tabAtiva]}
                onPress={() => {
                  setDirecao('C_PARA_F');
                  setConversao(null);
                }}
              >
                <Text style={[styles.tabText, direcao === 'C_PARA_F' && styles.tabTextAtiva]}>
                  Celsius → °F
                </Text>
              </Pressable>

              <Pressable
                style={[styles.tab, direcao === 'F_PARA_C' && styles.tabAtiva]}
                onPress={() => {
                  setDirecao('F_PARA_C');
                  setConversao(null);
                }}
              >
                <Text style={[styles.tabText, direcao === 'F_PARA_C' && styles.tabTextAtiva]}>
                  Fahrenheit → °C
                </Text>
              </Pressable>
            </View>

            <Text style={styles.label}>
              Temperatura em {direcao === 'C_PARA_F' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 30"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={temperatura}
              onChangeText={setTemperatura}
            />

            <Pressable
              style={({ pressed }) => [styles.btnConverter, pressed && styles.btnPressed]}
              onPress={executarConversao}
            >
              <Text style={styles.btnConverterText}>Converter Temperatura</Text>
            </Pressable>

            {conversao && (
              <View style={styles.resultadoCard}>
                <Text style={styles.resultadoLabel}>TEMPERATURA CONVERTIDA</Text>
                <Text style={styles.resultadoValor}>{conversao.destino}</Text>
                <Text style={styles.resultadoOrigem}>Origem: {conversao.origem}</Text>
                <Text style={styles.resultadoFormula}>Fórmula: {conversao.formula}</Text>
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
  label: { fontSize: 13, fontWeight: '600', color: '#CBD5E1', marginBottom: 8 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabAtiva: { backgroundColor: '#10B981' },
  tabText: { color: '#94A3B8', fontSize: 13, fontWeight: '700' },
  tabTextAtiva: { color: '#022C22' },
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
  btnConverter: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnConverterText: { color: '#022C22', fontSize: 16, fontWeight: '800' },
  resultadoCard: {
    marginTop: 20,
    padding: 18,
    backgroundColor: '#064E3B20',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#10B981',
    alignItems: 'center',
  },
  resultadoLabel: { fontSize: 11, fontWeight: '700', color: '#34D399', letterSpacing: 1 },
  resultadoValor: { fontSize: 32, fontWeight: '900', color: '#10B981', marginVertical: 6 },
  resultadoOrigem: { fontSize: 14, color: '#E2E8F0', fontWeight: '500' },
  resultadoFormula: { fontSize: 12, color: '#94A3B8', marginTop: 4, fontStyle: 'italic' },
});
