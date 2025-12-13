<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-heading font-bold">Channels</h1>
      <p class="text-muted-foreground">
        Manage your deployment channels (e.g., Production, Staging, Dev).
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="p-6 text-center text-red-500">
      Failed to load channels: {{ error.message }}
    </div>

    <ChannelsTable
      v-else
      :items="channels || []"
      @delete-item="handleDelete"
      @create-item="handleCreate"
    />
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

definePage({
  meta: {
    title: 'Channels - CapGO Admin',
    description: 'Manage app channels',
  },
})

const { data: channels, isLoading, error, refetch } = useChannelsQuery()
const deleteMutation = useDeleteChannelMutation()

const handleDelete = async (id: string) => {
  try {
    await deleteMutation.mutateAsync(id)
    toast.success('Channel deleted successfully')
    refetch()
  } catch (e: any) {
    toast.error(e || 'Failed to delete channel')
  }
}

const handleCreate = () => {
  toast.info('Create channel functionality coming soon')
}
</script>
