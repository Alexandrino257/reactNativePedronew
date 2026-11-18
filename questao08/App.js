import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function App() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');
  const [listaEstudantes, setListaEstudantes] = useState([
    {
      matricula: '20260001',
      nome: 'Maria Silva Santos',
      email: 'maria.silva@ufra.edu.br',
      curso: 'Sistemas de Informação',
    },
  ]);

  const cadastrarAluno = () => {
    Keyboard.dismiss();

    if (!nome.trim() || !matricula.trim() || !email.trim() || !curso.trim()) {
      Alert.alert('Campos Incompletos', 'Preencha todos os campos obrigatórios para registrar o aluno.');
      return;
    }

    const jaExiste = listaEstudantes.some(
      (e) => e.matricula.trim().toLowerCase() === matricula.trim().toLowerCase()
    );

    if (jaExiste) {
      Alert.alert('Matrícula Duplicada', `Já existe um aluno registrado com a matrícula ${matricula.trim()}.`);
      return;
    }

    const novoEstudante = {
      matricula: matricula.trim(),
      nome: nome.trim(),
      email: email.trim(),
      curso: curso.trim(),
    };

    setListaEstudantes((prev) => [novoEstudante, ...prev]);
    setNome('');
    setMatricula('');
    setEmail('');
    setCurso('');
    Alert.alert('Sucesso', 'Estudante matriculado com sucesso!');
  };

  const removerAluno = (mat) => {
    Alert.alert('Remover Registro', 'Deseja excluir este estudante do cadastro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          setListaEstudantes((prev) => prev.filter((e) => e.matricula !== mat));
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollArea} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SISTEMA ACADÊMICO</Text>
          </View>

          <Text style={styles.title}>Cadastro de Alunos</Text>
          <Text style={styles.subtitle}>Registre os discentes e visualize a relação em cards informativos.</Text>

          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Pedro Alexandrino"
            placeholderTextColor="#64748B"
            value={nome}
            onChangeText={setNome}
          />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Matrícula</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 20260102"
                placeholderTextColor="#64748B"
                value={matricula}
                onChangeText={setMatricula}
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>Curso</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Sistemas de Informação"
                placeholderTextColor="#64748B"
                value={curso}
                onChangeText={setCurso}
              />
            </View>
          </View>

          <Text style={styles.label}>E-mail Institucional</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: pedro.rocha@ufra.edu.br"
            placeholderTextColor="#64748B"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Pressable
            style={({ pressed }) => [styles.btnCadastrar, pressed && styles.btnPressed]}
            onPress={cadastrarAluno}
          >
            <Text style={styles.btnCadastrarText}>Salvar Cadastro</Text>
          </Pressable>
        </View>

        <View style={styles.listHeaderRow}>
          <Text style={styles.listSectionTitle}>Discentes Matriculados</Text>
          <Text style={styles.listCount}>{listaEstudantes.length} registro(s)</Text>
        </View>

        {listaEstudantes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Nenhum estudante matriculado no momento.</Text>
          </View>
        ) : (
          listaEstudantes.map((item) => (
            <View key={item.matricula} style={styles.studentCard}>
              <View style={styles.studentHeader}>
                <Text style={styles.studentName}>{item.nome}</Text>
                <Pressable
                  style={styles.btnRemover}
                  onPress={() => removerAluno(item.matricula)}
                >
                  <Text style={styles.btnRemoverText}>Remover</Text>
                </Pressable>
              </View>

              <View style={styles.studentTags}>
                <View style={styles.tagMatricula}>
                  <Text style={styles.tagMatriculaText}>Matrícula: {item.matricula}</Text>
                </View>
                <View style={styles.tagCurso}>
                  <Text style={styles.tagCursoText}>{item.curso}</Text>
                </View>
              </View>

              <Text style={styles.studentEmail}>✉️ {item.email}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B' },
  scrollArea: { padding: 20 },
  card: {
    backgroundColor: '#1C2541',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#3A506B',
    marginBottom: 24,
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
  subtitle: { fontSize: 13, color: '#94A3B8', marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#CBD5E1', marginBottom: 6 },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#F8FAFC',
    marginBottom: 14,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { width: '48%' },
  btnCadastrar: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnCadastrarText: { color: '#022C22', fontSize: 16, fontWeight: '800' },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  listSectionTitle: { fontSize: 16, fontWeight: '800', color: '#F8FAFC' },
  listCount: { fontSize: 12, color: '#34D399', fontWeight: '700' },
  emptyCard: {
    backgroundColor: '#1C2541',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A506B',
  },
  emptyText: { color: '#94A3B8', fontSize: 14 },
  studentCard: {
    backgroundColor: '#1C2541',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A506B',
  },
  studentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  studentName: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', flex: 1 },
  btnRemover: {
    backgroundColor: '#7F1D1D40',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnRemoverText: { color: '#F87171', fontSize: 12, fontWeight: '700' },
  studentTags: { flexDirection: 'row', marginVertical: 8, flexWrap: 'wrap', gap: 6 },
  tagMatricula: { backgroundColor: '#0F172A', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  tagMatriculaText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  tagCurso: { backgroundColor: '#064E3B', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  tagCursoText: { color: '#34D399', fontSize: 11, fontWeight: '600' },
  studentEmail: { fontSize: 13, color: '#CBD5E1', marginTop: 2 },
});
