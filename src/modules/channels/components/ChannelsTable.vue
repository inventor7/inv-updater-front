<template>
  <div class="space-y-4">
    <div class="flex items-center justify-end w-full">
      <Button @click="createNewChannel">
        <Plus class="mr-2 h-4 w-4" />
        Create Channel
      </Button>
    </div>

    <DataTable
      :columns="channelsColumns"
      :data="items"
      :config="tableConfig"
      :filters="tableFilters"
      @row-click="handleRowClick"
    />

    <ChannelsDeleteDialog
      v-model:delete-dialog-open="deleteDialogOpen"
      :is-deleting="isDeleting"
      :item-to-delete="itemToDelete"
      :selected-items="selectedItems"
      @click:handle-delete-confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { channelsColumns } from './ChannelsTable/channels.columns'
import ChannelsDeleteDialog from './ChannelsTable/ChannelsDeleteDialog.vue'
import {
  DataTable,
  type DataTableConfig,
  type DataTableFilterDef,
} from '@/components/common/DataTable'
import type { Channel } from '../types/channels.types'
import { Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'

const { items } = defineProps<{
  items: Channel[]
}>()

const emit = defineEmits<{
  (e: 'deleteItem', id: string): void
  (e: 'createItem'): void
}>()

const selectedItems = ref<Channel[]>([])
const deleteDialogOpen = ref(false)
const itemToDelete = ref<string | null>(null)
const isDeleting = ref(false)

const tableConfig: DataTableConfig = {
  features: {
    sorting: true,
    filtering: true,
    pagination: true,
    selection: true,
    columnVisibility: true,
    density: true,
    columnOrdering: true,
    columnPinning: true,
    columnSizing: true,
    bulkActions: true,
    stickyHeader: true,
    zebra: true,
    resizableColumns: true,
    fuzzyFiltering: true,
  },
  defaults: {
    pageSize: 10,
    density: 'normal',
  },
}

const tableFilters = computed<DataTableFilterDef[]>(() => [
  {
    columnId: 'platform',
    title: 'Platform',
    options: [
      { label: 'Android', value: 'android' },
      { label: 'iOS', value: 'ios' },
      { label: 'Web', value: 'web' },
    ],
  },
])

const handleDeleteConfirm = async () => {
  // Logic to handle delete
  if (itemToDelete.value) {
    emit('deleteItem', itemToDelete.value)
  }
  deleteDialogOpen.value = false
  itemToDelete.value = null
}

import { useRouter } from 'vue-router'

const router = useRouter()

const handleRowClick = (item: Channel) => {
  router.push(`/channels/${item.id}`)
}

const createNewChannel = () => {
  emit('createItem')
}
</script>
