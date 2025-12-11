<template>
  <div class="space-y-4">
    <UpdatesBundlesTableBulkEdit
      :selected-items="selectedItems"
      @click:bulk-delete="handleBulkDelete"
      @click:bulk-edit="handleBulkEdit"
      @click:bulk-export="handleBulkExport"
      @click:clear-selection="clearSelection"
    />
    <UpdatesBundlesTableDataTable
      ref="dataTableRef"
      :columns="updatesBundlesColumns"
      :data="items"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    />

    <UpdatesBundlesTableDeleteDialog
      v-model:delete-dialog-open="deleteDialogOpen"
      :is-deleting="isDeleting"
      :item-to-delete="itemToDelete"
      :selected-items="selectedItems"
      @click:handle-delete-confirm="handleDeleteConfirm"
    />

    <UpdatesBundlesTableBulkEditDialog
      v-model:bulkEditData="bulkEditData"
      v-model:bulkEditDialogOpen="bulkEditDialogOpen"
      :selected-items="selectedItems"
      @click:bulk-edit-confirm="handleBulkEditConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { updatesBundlesColumns } from './UpdatesBundlesTable/updates-bundles.columns'
import type { UpdateOrBundle } from '../types/updates-bundles.types'

const router = useRouter()
const dataTableRef = ref()
const selectedItems = ref<UpdateOrBundle[]>([])
const deleteDialogOpen = ref(false)
const bulkEditDialogOpen = ref(false)
const itemToDelete = ref<string | number | null>(null)
const isDeleting = ref(false)

const bulkEditData = ref({
  channel: '',
  environment: '',
  required: '',
  active: '',
})

const props = defineProps<{
  items: UpdateOrBundle[]
}>()

const emit = defineEmits<{
  (e: 'deleteItem', id: string | number, type: 'bundle' | 'native'): void
  (e: 'updateItem', item: UpdateOrBundle): void
}>()

const handleSelectionChange = (selection: UpdateOrBundle[]) => {
  selectedItems.value = selection
}

const handleRowClick = (item: UpdateOrBundle) => {
  // Navigate to the detail page with type query param
  router.push(`/updates-bundles/${item.id}?type=${item.type}`)
}

const handleBulkEdit = () => {
  bulkEditDialogOpen.value = true
  bulkEditData.value = {
    channel: '',
    environment: '',
    required: '',
    active: '',
  }
}

const handleBulkEditConfirm = () => {
  console.log('Bulk editing items:', {
    ids: selectedItems.value.map((p) => p.id),
    changes: bulkEditData.value,
  })
  bulkEditDialogOpen.value = false
  clearSelection()
}

const handleBulkExport = () => {
  console.log(
    'Exporting items:',
    selectedItems.value.map((p) => p.id),
  )
  const csv = selectedItems.value
    .map(
      (p) =>
        `${p.id},${p.type},${p.version},${p.platform},${p.channel},${p.environment},${p.required},${p.active}`,
    )
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'updates-bundles.csv'
  a.click()
}

const handleBulkDelete = () => {
  itemToDelete.value = null
  deleteDialogOpen.value = true
}

const handleDeleteConfirm = async () => {
  isDeleting.value = true

  try {
    if (itemToDelete.value) {
      // Single item delete
      const item = props.items.find((i) => i.id === itemToDelete.value)
      if (item) {
        emit('deleteItem', item.id, item.type)
      }
    } else {
      // Bulk delete
      selectedItems.value.forEach((item) => {
        emit('deleteItem', item.id, item.type)
      })
    }

    clearSelection()
  } catch (error) {
    console.error('Delete error:', error)
  } finally {
    isDeleting.value = false
    deleteDialogOpen.value = false
    itemToDelete.value = null
  }
}

const clearSelection = () => {
  if (dataTableRef.value) {
    dataTableRef.value.clearSelection()
  }
  selectedItems.value = []
}

defineExpose({
  triggerDelete: (itemId: string | number) => {
    itemToDelete.value = itemId
    deleteDialogOpen.value = true
  },
  clearSelection,
})
</script>
