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
  const [nomeProduto, setNomeProduto] = useState('');
  const [estoqueAtual, setEstoqueAtual] = useState(0);
  const [qtdMovimento, setQtdMovimento] = useState('');
  const [produtoIniciado, setProdutoIniciado] = useState(false);

  const iniciarEstoque = () => {
    Keyboard.dismiss();
    const qtdInicial = parseInt(qtdMovimento, 10);

    if (!nomeProduto.trim()) {
      Alert.alert('Produto Obrigatório', 'Informe a identificação ou nome do produto.');
      return;
    }

    if (isNaN(qtdInicial) || qtdInicial < 0) {
      Alert.alert('Valor Inválido', 'A quantidade inicial precisa ser um número maior ou igual a zero.');
      return;
    }

    setEstoqueAtual(qtdInicial);
    setProdutoIniciado(true);
    setQtdMovimento('');

    if (qtdInicial < 5) {
      Alert.alert('Atenção - Estoque Crítico', `O estoque inicial de "${nomeProduto}" possui apenas ${qtdInicial} unidade(s)!`);
    }
  };

  const adicionarEstoque = () => {
    Keyboard.dismiss();
    const qtd = parseInt(qtdMovimento, 10);

    if (isNaN(qtd) || qtd <= 0) {
      Alert.alert('Quantidade Inválida', 'Informe uma quantidade positiva para adicionar.');
      return;
    }

    const novoTotal = estoqueAtual + qtd;
    setEstoqueAtual(novoTotal);
    setQtdMovimento('');

    if (novoTotal < 5) {
      Alert.alert('Alerta de Reposição', `Estoque baixo: restam ${novoTotal} unidade(s).`);
    }
  };

  const retirarEstoque = () => {
    Keyboard.dismiss();
    const qtd = parseInt(qtdMovimento, 10);

    if (isNaN(qtd) || qtd <= 0) {
      Alert.alert('Quantidade Inválida', 'Informe uma quantidade positiva para retirar.');
      return;
    }

    if (qtd > estoqueAtual) {
      Alert.alert(
        'Operação Bloqueada',
        `Não é possível retirar ${qtd} unidades. Disponível em estoque: ${estoqueAtual} unidade(s).`
      );
      return;
    }

    const novoTotal = estoqueAtual - qtd;
    setEstoqueAtual(novoTotal);
    setQtdMovimento('');

    if (novoTotal < 5) {
      Alert.alert('Alerta de Reposição', `Atenção: restam menos de 5 unidades (${novoTotal} unid.) no estoque de ${nomeProduto}!`);
    }
  };

  const resetarProduto = () => {
    setNomeProduto('');
    setEstoqueAtual(0);
    setQtdMovimento('');
    setProdutoIniciado(false);
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
              <Text style={styles.badgeText}>GESTÃO DE INVENTÁRIO</Text>
            </View>

            <Text style={styles.title}>Controle de Estoque</Text>

            <Text style={styles.label}>Nome da Mercadoria</Text>
            <TextInput
              style={[styles.input, produtoIniciado && styles.inputDisabled]}
              placeholder="Ex: Roteador Wi-Fi Gigabit"
              placeholderTextColor="#64748B"
              value={nomeProduto}
              onChangeText={setNomeProduto}
              editable={!produtoIniciado}
            />

            {!produtoIniciado ? (
              <>
                <Text style={styles.label}>Quantidade Inicial em Estoque</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 20"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  value={qtdMovimento}
                  onChangeText={setQtdMovimento}
                />
                <Pressable
                  style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
                  onPress={iniciarEstoque}
                >
                  <Text style={styles.btnPrimaryText}>Inicializar Estoque</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={[styles.stockDisplay, estoqueAtual < 5 ? styles.stockLow : styles.stockNormal]}>
                  <Text style={styles.stockLabel}>SALDO DISPONÍVEL</Text>
                  <Text style={styles.stockQty}>{estoqueAtual} <Text style={styles.stockUnit}>unid.</Text></Text>
                  {estoqueAtual < 5 && (
                    <Text style={styles.warningTag}>⚠️ ESTOQUE CRÍTICO (MENOS DE 5)</Text>
                  )}
                </View>

                <Text style={styles.label}>Quantidade para Movimentação</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 5"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  value={qtdMovimento}
                  onChangeText={setQtdMovimento}
                />

                <View style={styles.btnRow}>
                  <Pressable
                    style={({ pressed }) => [styles.btnAction, styles.btnAdd, pressed && styles.btnPressed]}
                    onPress={adicionarEstoque}
                  >
                    <Text style={styles.btnActionText}>+ Adicionar</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [styles.btnAction, styles.btnSub, pressed && styles.btnPressed]}
                    onPress={retirarEstoque}
                  >
                    <Text style={styles.btnActionText}>- Retirar</Text>
                  </Pressable>
                </View>

                <Pressable style={styles.btnReset} onPress={resetarProduto}>
                  <Text style={styles.btnResetText}>Trocar / Resetar Mercadoria</Text>
                </Pressable>
              </>
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
  inputDisabled: { opacity: 0.65, backgroundColor: '#131D31' },
  btnPrimary: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnPrimaryText: { color: '#022C22', fontSize: 16, fontWeight: '800' },
  stockDisplay: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    marginBottom: 18,
  },
  stockNormal: { backgroundColor: '#064E3B20', borderColor: '#10B981' },
  stockLow: { backgroundColor: '#7F1D1D25', borderColor: '#EF4444' },
  stockLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1 },
  stockQty: { fontSize: 36, fontWeight: '900', color: '#F8FAFC', marginVertical: 4 },
  stockUnit: { fontSize: 16, fontWeight: '600', color: '#CBD5E1' },
  warningTag: { color: '#F87171', fontSize: 12, fontWeight: '700', marginTop: 4 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  btnAction: { flex: 0.48, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnAdd: { backgroundColor: '#10B981' },
  btnSub: { backgroundColor: '#EF4444' },
  btnActionText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  btnReset: { paddingVertical: 10, alignItems: 'center' },
  btnResetText: { color: '#94A3B8', fontSize: 12, textDecorationLine: 'underline' },
});
