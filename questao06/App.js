import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [candidatos, setCandidatos] = useState([
    { id: 1, nome: 'Chapa 01 - Pedro Alexandrino', slogan: 'Inovação e Tecnologia Discente', votos: 0 },
    { id: 2, nome: 'Chapa 02 - Arthur Rocha', slogan: 'Cultura, Esporte e Apoio Acadêmico', votos: 0 },
    { id: 3, nome: 'Chapa 03 - Carlos Kauan', slogan: 'Integração e Modernização UFRA', votos: 0 },
  ]);

  const registrarVoto = (id) => {
    setCandidatos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, votos: c.votos + 1 } : c))
    );
  };

  const totalVotos = candidatos.reduce((acc, c) => acc + c.votos, 0);

  const obterResultadoLideranca = () => {
    if (totalVotos === 0) return { texto: 'Aguardando primeiros votos...', isEmpate: false };

    const maxVotos = Math.max(...candidatos.map((c) => c.votos));
    const lideres = candidatos.filter((c) => c.votos === maxVotos);

    if (lideres.length > 1) {
      return {
        texto: `Empate na liderança: ${lideres.map((l) => l.nome).join(' e ')} com ${maxVotos} voto(s) cada.`,
        isEmpate: true,
      };
    }

    return {
      texto: `Candidato mais votado: ${lideres[0].nome} com ${maxVotos} voto(s).`,
      isEmpate: false,
    };
  };

  const zerarUrna = () => {
    setCandidatos((prev) => prev.map((c) => ({ ...c, votos: 0 })));
  };

  const resultado = obterResultadoLideranca();

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ELEIÇÃO DISCENTE</Text>
        </View>

        <Text style={styles.title}>Votação de Representantes</Text>
        <Text style={styles.subtitle}>Vote na chapa de sua preferência para representar o curso.</Text>

        {candidatos.map((c) => {
          const perc = totalVotos > 0 ? ((c.votos / totalVotos) * 100).toFixed(1) : '0.0';
          return (
            <View key={c.id} style={styles.candidateCard}>
              <View style={styles.candidateInfo}>
                <Text style={styles.candidateName}>{c.nome}</Text>
                <Text style={styles.candidateSlogan}>{c.slogan}</Text>
                <Text style={styles.candidateScore}>
                  {c.votos} voto(s) • <Text style={styles.percText}>{perc}%</Text>
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [styles.btnVotar, pressed && styles.btnPressed]}
                onPress={() => registrarVoto(c.id)}
              >
                <Text style={styles.btnVotarText}>Votar</Text>
              </Pressable>
            </View>
          );
        })}

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TOTAL DE VOTOS</Text>
            <Text style={styles.summaryTotal}>{totalVotos}</Text>
          </View>
          <View style={[styles.liderancaBox, resultado.isEmpate ? styles.empateStyle : styles.liderStyle]}>
            <Text style={styles.liderancaTexto}>{resultado.texto}</Text>
          </View>
        </View>

        {totalVotos > 0 && (
          <Pressable style={styles.btnZerar} onPress={zerarUrna}>
            <Text style={styles.btnZerarText}>Reiniciar Votação</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0B132B', padding: 22, justifyContent: 'center' },
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
  title: { fontSize: 22, fontWeight: '800', color: '#F8FAFC', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94A3B8', marginBottom: 18 },
  candidateCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  candidateInfo: { flex: 1, paddingRight: 10 },
  candidateName: { fontSize: 15, fontWeight: '700', color: '#F8FAFC' },
  candidateSlogan: { fontSize: 11, color: '#94A3B8', marginVertical: 2 },
  candidateScore: { fontSize: 13, color: '#CBD5E1', marginTop: 4, fontWeight: '600' },
  percText: { color: '#34D399' },
  btnVotar: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnVotarText: { color: '#022C22', fontWeight: '800', fontSize: 14 },
  summaryBox: {
    marginTop: 14,
    backgroundColor: '#0B132B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },
  summaryTotal: { fontSize: 24, fontWeight: '900', color: '#F8FAFC' },
  liderancaBox: { marginTop: 12, padding: 12, borderRadius: 8 },
  liderStyle: { backgroundColor: '#064E3B40', borderWidth: 1, borderColor: '#10B981' },
  empateStyle: { backgroundColor: '#78350F40', borderWidth: 1, borderColor: '#F59E0B' },
  liderancaTexto: { color: '#F8FAFC', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  btnZerar: { marginTop: 16, alignItems: 'center' },
  btnZerarText: { color: '#94A3B8', fontSize: 12, textDecorationLine: 'underline' },
});
