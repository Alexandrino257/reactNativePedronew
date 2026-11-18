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
  const [peso, setPeso] = useState('');
  const [resultadoLitros, setResultadoLitros] = useState(null);
  const [qtdCopos, setQtdCopos] = useState(null);

  const calcularHidratacao = () => {
    Keyboard.dismiss();
    const pesoFormatado = peso.replace(',', '.').trim();
    const pesoNum = parseFloat(pesoFormatado);

    if (!pesoFormatado || isNaN(pesoNum) || pesoNum <= 0) {
      Alert.alert('Entrada Inválida', 'Por favor, insira um peso válido maior que zero (kg).');
      setResultadoLitros(null);
      setQtdCopos(null);
      return;
    }

    // 35 mL por kg convertido para litros
    const totalLitros = (pesoNum * 35) / 1000;
    const copos = Math.round((totalLitros * 1000) / 250);

    setResultadoLitros(totalLitros.toFixed(2));
    setQtdCopos(copos);
  };

  const limparCampos = () => {
    setPeso('');
    setResultadoLitros(null);
    setQtdCopos(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollWrapper} bounces={false}>
          <View style={styles.cardContainer}>
            <View style={styles.badgeTag}>
              <Text style={styles.badgeTagText}>SAÚDE & BEM-ESTAR</Text>
            </View>

            <Text style={styles.headingTitle}>Monitor de Hidratação</Text>
            <Text style={styles.headingDescription}>
              Calcule sua recomendação diária de ingestão hídrica com base na taxa didática de 35 mL por quilo.
            </Text>

            <Text style={styles.inputLabel}>Seu Peso Corporal (kg)</Text>
            <TextInput
              style={styles.textInputField}
              placeholder="Exemplo: 70"
              placeholderTextColor="#64748B"
              keyboardType="decimal-pad"
              value={peso}
              onChangeText={setPeso}
            />

            <Pressable
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
              onPress={calcularHidratacao}
            >
              <Text style={styles.actionButtonText}>Calcular Hidratação</Text>
            </Pressable>

            {resultadoLitros && (
              <View style={styles.resultBox}>
                <Text style={styles.resultTitle}>Meta Diária Recomendada</Text>
                <Text style={styles.resultValue}>{resultadoLitros} <Text style={styles.unitSuffix}>L/dia</Text></Text>
                <Text style={styles.subtextCopos}>Aproximadamente {qtdCopos} copos de 250 mL</Text>

                <Pressable style={styles.resetButton} onPress={limparCampos}>
                  <Text style={styles.resetButtonText}>Limpar</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  cardContainer: {
    backgroundColor: '#1C2541',
    borderRadius: 18,
    padding: 26,
    borderWidth: 1,
    borderColor: '#3A506B',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  badgeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#064E3B',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#059669',
  },
  badgeTagText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  headingTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  headingDescription: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 22,
    lineHeight: 21,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  textInputField: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#F8FAFC',
    marginBottom: 18,
  },
  actionButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonPressed: {
    backgroundColor: '#059669',
    transform: [{ scale: 0.98 }],
  },
  actionButtonText: {
    color: '#022C22',
    fontSize: 16,
    fontWeight: '800',
  },
  resultBox: {
    marginTop: 22,
    padding: 20,
    backgroundColor: '#064E3B22',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#10B981',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 34,
    fontWeight: '900',
    color: '#10B981',
    marginTop: 6,
  },
  unitSuffix: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A7F3D0',
  },
  subtextCopos: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6,
  },
  resetButton: {
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  resetButtonText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
});
