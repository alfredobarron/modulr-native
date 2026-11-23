import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SectionList } from 'react-native';

import { CatalogControls } from '@/catalog/pieces';
import { Button } from '@/src/components/ui/button';
import { FilterPills } from '@/src/components/ui/filter-pills';
import { Header } from '@/src/components/ui/header';
import { ListItem } from '@/src/components/ui/list-item';
import { ListScreen, useListContentStyle } from '@/src/components/ui/list-screen';
import { SectionHeading } from '@/src/components/ui/section-heading';
import { Text } from '@/src/components/ui/text';
import type { Tone } from '@/src/theme/tokens';

type Task = { id: string; title: string; project: string; hours: number; status: { label: string; tone: Tone } };

const TITLES = ['Revisar el contrato', 'Preparar la presentación', 'Responder a proveedores', 'Actualizar el inventario'];
const PROJECTS = ['Proyecto Atlas', 'Proyecto Boreal', 'Proyecto Cima'];

function buildTasks(from: number, count: number, status: Task['status']): Task[] {
  return Array.from({ length: count }, (_, index) => ({
    hours: 1 + (index % 4),
    id: String(from - index),
    project: PROJECTS[index % PROJECTS.length],
    status,
    title: TITLES[index % TITLES.length],
  }));
}

const SECTIONS = [
  { key: 'curso', title: 'En curso', data: buildTasks(128, 3, { label: 'En curso', tone: 'warning' }) },
  { key: 'terminadas', title: 'Terminadas', data: buildTasks(125, 12, { label: 'Terminada', tone: 'success' }) },
  { key: 'canceladas', title: 'Canceladas', data: buildTasks(113, 3, { label: 'Cancelada', tone: 'neutral' }) },
];

const FILTERS = [
  { key: 'todas', label: 'Todas', count: 18 },
  ...SECTIONS.map((section) => ({ key: section.key, label: section.title, count: section.data.length })),
];

export default function ListDemo() {
  const router = useRouter();
  const contentStyle = useListContentStyle();
  const [filter, setFilter] = useState('todas');
  const sections = filter === 'todas' ? SECTIONS : SECTIONS.filter((section) => section.key === filter);

  return (
    <ListScreen
      footer={<Button fullWidth icon="add" label="Nueva tarea" size="lg" />}
      header={<Header onBack={() => router.back()} right={<CatalogControls />} subtitle="18 esta semana" title="Tareas" />}>
      <SectionList
        contentContainerStyle={contentStyle}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<FilterPills active={filter} onChange={setFilter} options={FILTERS} />}
        renderItem={({ item }) => (
          <ListItem
            icon="document-text-outline"
            meta={item.project}
            onPress={() => router.push('/demo/detail')}
            status={item.status}
            title={item.title}
            trailing={<Text variant="data">{item.hours} h</Text>}
          />
        )}
        renderSectionHeader={({ section }) => <SectionHeading count={section.data.length} title={section.title} />}
        sections={sections}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </ListScreen>
  );
}
