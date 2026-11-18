import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';

const CARDAPIO = [
  { id: 1, nome: 'Sanduíche Natural de Frango', preco: 8.0, categoria: 'Lanche' },
  { id: 2, nome: 'Suco Natural da Fruta (400ml)', preco: 5.0, categoria: 'Bebida' },
  { id: 3, nome: 'Salgado Assado Integral', preco: 6.5, categoria: 'Salgado' },
  { id: 4, nome: 'Açaí na Tigela (300ml)', preco: 10.0, categoria: 'Sobremesa' },
  { id: 5, nome: 'Café com Leite Quente', preco: 4.0, categoria: 'Bebida' },
];

export default function App() {
  const [pedido, setPedido] = useState([]);

  const formatarMoeda = (val) => 'R$ ' + val.toFixed(2).replace('.', ',');

  const adicionarProduto = (produto) => {
    setPedido((prev) => {
      const idx = prev.findIndex((item) => item.id === produto.id);
      if (idx > -1) {
        const atualizado = [...prev];
        const novaQtd = atualizado[idx].quantidade + 1;
        atualizado[idx] = {
          ...atualizado[idx],
          quantidade: novaQtd,
          subtotal: novaQtd * atualizado[idx].preco,
        };
        return atualizado;
      }
      return [
        ...prev,
        {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
          subtotal: produto.preco,
        },
      ];
    });
  };

  const removerProduto = (id) => {
    setPedido((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (item.quantidade > 1) {
        return prev.map((i) =>
          i.id === id
            ? { ...i, quantidade: i.quantidade - 1, subtotal: (i.quantidade - 1) * i.preco }
            : i
        );
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const limparPedido = () => {
    setPedido([]);
  };

  const finalizarPedido = () => {
    if (pedido.length === 0) {
      Alert.alert('Pedido Vazio', 'Adicione pelo menos um item do cardápio para finalizar.');
      return;
    }
    Alert.alert(
      'Pedido Confirmado!',
      `Seu pedido totalizou ${formatarMoeda(totalGeral)}. Dirija-se ao balcão para retirada.`,
      [{ text: 'OK', onPress: () => setPedido([]) }]
    );
  };

  const totalGeral = pedido.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.cardWrapper}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AUTOATENDIMENTO</Text>
        </View>

        <Text style={styles.title}>Lanchonete Universitária</Text>
        <Text style={styles.subtitle}>Monte seu pedido selecionando os produtos desejados.</Text>

        <Text style={styles.sectionHeading}>Cardápio Disponível</Text>

        {CARDAPIO.map((p) => {
          const itemNoPedido = pedido.find((item) => item.id === p.id);
          const qtdAtual = itemNoPedido ? itemNoPedido.quantidade : 0;

          return (
            <View key={p.id} style={styles.menuItem}>
              <View style={styles.menuInfo}>
                <Text style={styles.menuNome}>{p.nome}</Text>
                <Text style={styles.menuPreco}>{formatarMoeda(p.preco)}</Text>
              </View>

              <View style={styles.controlsRow}>
                {qtdAtual > 0 && (
                  <Pressable
                    style={[styles.btnControl, styles.btnSub]}
                    onPress={() => removerProduto(p.id)}
                  >
                    <Text style={styles.btnControlText}>-</Text>
                  </Pressable>
                )}

                {qtdAtual > 0 && (
                  <Text style={styles.qtdBadge}>{qtdAtual}</Text>
                )}

                <Pressable
                  style={[styles.btnControl, styles.btnAdd]}
                  onPress={() => adicionarProduto(p)}
                >
                  <Text style={styles.btnControlText}>+</Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>Resumo do Pedido</Text>

        {pedido.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhum produto adicionado ainda.</Text>
          </View>
        ) : (
          <View style={styles.orderSummary}>
            {pedido.map((item) => (
              <View key={item.id} style={styles.orderRow}>
                <Text style={styles.orderItemName}>
                  {item.quantidade}x {item.nome}
                </Text>
                <Text style={styles.orderItemSubtotal}>
                  {formatarMoeda(item.subtotal)}
                </Text>
              </View>
            ))}

            <View style={styles.summaryTotalRow}>
              <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
              <Text style={styles.totalValue}>{formatarMoeda(totalGeral)}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.btnFinalizar, pressed && styles.btnPressed]}
              onPress={finalizarPedido}
            >
              <Text style={styles.btnFinalizarText}>Concluir Pedido</Text>
            </Pressable>

            <Pressable style={styles.btnLimpar} onPress={limparPedido}>
              <Text style={styles.btnLimparText}>Limpar Pedido</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0B132B', padding: 20 },
  cardWrapper: {
    backgroundColor: '#1C2541',
    borderRadius: 18,
    padding: 22,
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
  title: { fontSize: 22, fontWeight: '800', color: '#F8FAFC', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94A3B8', marginBottom: 18 },
  sectionHeading: { fontSize: 15, fontWeight: '700', color: '#CBD5E1', marginBottom: 12 },
  menuItem: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuInfo: { flex: 1, paddingRight: 8 },
  menuNome: { fontSize: 14, fontWeight: '700', color: '#F8FAFC' },
  menuPreco: { fontSize: 13, color: '#34D399', fontWeight: '600', marginTop: 2 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnControl: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAdd: { backgroundColor: '#10B981' },
  btnSub: { backgroundColor: '#334155' },
  btnControlText: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
  qtdBadge: { color: '#F8FAFC', fontSize: 15, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 18 },
  emptyBox: {
    backgroundColor: '#0F172A',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyText: { color: '#64748B', fontSize: 13 },
  orderSummary: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1E293B',
  },
  orderItemName: { color: '#CBD5E1', fontSize: 13, flex: 1 },
  orderItemSubtotal: { color: '#F8FAFC', fontSize: 13, fontWeight: '600' },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  totalLabel: { fontSize: 13, fontWeight: '800', color: '#94A3B8' },
  totalValue: { fontSize: 24, fontWeight: '900', color: '#10B981' },
  btnFinalizar: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnFinalizarText: { color: '#022C22', fontSize: 15, fontWeight: '800' },
  btnLimpar: { marginTop: 10, alignItems: 'center' },
  btnLimparText: { color: '#94A3B8', fontSize: 12, textDecorationLine: 'underline' },
});
