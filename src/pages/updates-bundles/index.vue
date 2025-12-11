<template>
  <div class="space-y-6">
    <UpdatesBundlesHeader />

    <UpdatesBundlesTable
      :items="filteredItems"
      @delete-item="handleDelete"
      @update-item="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
definePage({
  meta: {
    title: 'Updates & Bundles - CapGO Updater',
    description: 'Manage app updates and bundles',
    category: 'updates-bundles',
    hideFromSearch: false,
  },
})

// State
const searchTerm = ref('')
const filterType = ref('all')
const filterChannel = ref('all')
const filterPlatform = ref('all')
const filterEnvironment = ref('all')

// Get data using composable
const { data: items, refetch } = useUpdatesBundlesQuery()

// Filter items based on search and filters
const filteredItems = computed(() => {
  if (!items.value) return []

  return items.value.filter((item) => {
    const matchesSearch =
      item.version.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      item.channel.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (item.release_notes?.toLowerCase().includes(searchTerm.value.toLowerCase()) ?? false)

    const matchesType = filterType.value === 'all' || item.type === filterType.value
    const matchesChannel = filterChannel.value === 'all' || item.channel === filterChannel.value
    const matchesPlatform = filterPlatform.value === 'all' || item.platform === filterPlatform.value
    const matchesEnvironment =
      filterEnvironment.value === 'all' || item.environment === filterEnvironment.value

    return matchesSearch && matchesType && matchesChannel && matchesPlatform && matchesEnvironment
  })
})

const handleDelete = async (id: string | number, type: 'bundle' | 'native') => {
  // In a real implementation, you would call the appropriate delete mutation
  // For now, we'll just trigger a refetch
  console.log('iddd', id, type)
  await refetch()
}

const handleUpdate = (item: UpdateOrBundle) => {
  // In a real implementation, you would update the specific item
  console.log('Update item:', item)
}
</script>
