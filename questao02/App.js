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
  const [estudante, setEstudante] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [nota3, setNota3] = useState('');
  const [boletim, setBoletim] = useState(null);

  const calcularDesempenho = () => {
    Keyboard.dismiss();

    if (!estudante.trim()) {
      Alert.alert('Atenção', 'Informe o nome do estudante.');
      return;
    }

    const n1 = parseFloat(nota1.replace(',', '.'));
    const n2 = parseFloat(nota2.replace(',', '.'));
    const n3 = parseFloat(nota3.replace(',', '.'));

    const notasArray = [n1, n2, n3];
    const temInvalida = notasArray.some((val) => isNaN(val) || val < 0 || val > 10);

    if (temInvalida || nota1.trim() === '' || nota2.trim() === '' || nota3.trim() === '') {
      Alert.alert('Notas Inválidas', 'Insira as 3 notas com valores válidos entre 0.0 e 10.0.');
      return;
    }

    const mediaCalculada = (n1 + n2 + n3) / 3;
    const aprovado = mediaCalculada >= 7.0;

    setBoletim({
      aluno: estudante.trim(),
      n1: n1.toFixed(1),
      n2: n2.toFixed(1),
      n3: n3.toFixed(1),
      media: mediaCalculada.toFixed(1),
      status: aprovado ? 'Aprovado' : 'Reprovado',
      isAprovado: aprovado,
    });
  };

  const reiniciarCalculo = () => {
    setEstudante('');
    setNota1('');
    setNota2('');
    setNota3('');
    setBoletim(null);
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
              <Text style={styles.badgeText}>SISTEMA DE NOTAS</Text>
            </View>

            <Text style={styles.title}>Média Acadêmica</Text>
            <Text style={styles.subtitle}>
              Insira o nome e as 3 notas do estudante para verificar a situação final (Aprovação: Média ≥ 7.0).
            </Text>

            <Text style={styles.label}>Nome do Estudante</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Carlos Silva"
              placeholderTextColor="#64748B"
              value={estudante}
              onChangeText={setEstudante}
            />

            <View style={styles.rowNotas}>
              <View style={styles.colNota}>
                <Text style={styles.label}>Nota 1</Text>
                <TextInput
                  style={styles.inputNota}
                  placeholder="0.0 - 10"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={nota1}
                  onChangeText={setNota1}
                />
              </View>
              <View style={styles.colNota}>
                <Text style={styles.label}>Nota 2</Text>
                <TextInput
                  style={styles.inputNota}
                  placeholder="0.0 - 10"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={nota2}
                  onChangeText={setNota2}
                />
              </View>
              <View style={styles.colNota}>
                <Text style={styles.label}>Nota 3</Text>
                <TextInput
                  style={styles.inputNota}
                  placeholder="0.0 - 10"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={nota3}
                  onChangeText={setNota3}
                />
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.btnCalcular, pressed && styles.btnPressed]}
              onPress={calcularDesempenho}
            >
              <Text style={styles.btnCalcularText}>Calcular Média</Text>
            </Pressable>

            {boletim && (
              <View
                style={[
                  styles.boletimCard,
                  boletim.isAprovado ? styles.boletimAprovado : styles.boletimReprovado,
                ]}
              >
                <Text style={styles.boletimAluno}>{boletim.aluno}</Text>
                <Text style={styles.boletimNotasDet}>
                  Notas: {boletim.n1} | {boletim.n2} | {boletim.n3}
                </Text>

                <View style={styles.boletimDiv} />

                <View style={styles.boletimRowResult}>
                  <View>
                    <Text style={styles.boletimMediaLabel}>Média Final</Text>
                    <Text style={styles.boletimMediaVal}>{boletim.media}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      boletim.isAprovado ? styles.statusBadgeAp : styles.statusBadgeRep,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        boletim.isAprovado ? styles.statusTextAp : styles.statusTextRep,
                      ]}
                    >
                      {boletim.status}
                    </Text>
                  </View>
                </View>

                <Pressable style={styles.btnNovoCalculo} onPress={reiniciarCalculo}>
                  <Text style={styles.btnNovoCalculoText}>Novo Cálculo</Text>
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
    paddingVertical: 12,
    fontSize: 15,
    color: '#F8FAFC',
    marginBottom: 16,
  },
  rowNotas: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  colNota: { width: '31%' },
  inputNota: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#F8FAFC',
    textAlign: 'center',
  },
  btnCalcular: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnCalcularText: { color: '#022C22', fontSize: 16, fontWeight: '800' },
  boletimCard: {
    marginTop: 22,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  boletimAprovado: { backgroundColor: '#064E3B20', borderColor: '#10B981' },
  boletimReprovado: { backgroundColor: '#7F1D1D20', borderColor: '#EF4444' },
  boletimAluno: { fontSize: 18, fontWeight: '700', color: '#F8FAFC' },
  boletimNotasDet: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  boletimDiv: { height: 1, backgroundColor: '#334155', marginVertical: 14 },
  boletimRowResult: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  boletimMediaLabel: { fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', fontWeight: '600' },
  boletimMediaVal: { fontSize: 28, fontWeight: '900', color: '#F8FAFC' },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  statusBadgeAp: { backgroundColor: '#064E3B' },
  statusBadgeRep: { backgroundColor: '#7F1D1D' },
  statusBadgeText: { fontSize: 14, fontWeight: '800' },
  statusTextAp: { color: '#34D399' },
  statusTextRep: { color: '#FCA5A5' },
  btnNovoCalculo: {
    marginTop: 14,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 8,
  },
  btnNovoCalculoText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
});
