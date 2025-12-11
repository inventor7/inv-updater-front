<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h1 class="text-3xl font-bold tracking-tight capitalize">{{ channelName }}</h1>
          <Badge variant="outline">Channel</Badge>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground text-sm">
          <span>Created {{ formatDate(channel?.created_at) }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <ILucidePencil class="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" size="sm">
          <ILucideTrash2 class="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Bundles</CardTitle>
          <ILucidePackage class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ channelBundles.length }}</div>
          <p class="text-xs text-muted-foreground">Deployed to this channel</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Devices</CardTitle>
          <ILucideSmartphone class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ channelDevices.length }}</div>
          <p class="text-xs text-muted-foreground">Currently on this channel</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Platform</CardTitle>
          <ILucideGlobe class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold capitalize">{{ channel?.platform || 'All' }}</div>
          <p class="text-xs text-muted-foreground">Target platform</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Latest Version</CardTitle>
          <ILucideGitCommit class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ latestVersion || 'N/A' }}</div>
          <p class="text-xs text-muted-foreground">Most recent update</p>
        </CardContent>
      </Card>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 space-y-6">
        <!-- Configuration Snippet -->
        <Card>
          <CardHeader>
            <CardTitle>SDK Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto relative group">
              <pre>{{ configSnippet }}</pre>
              <Button
                variant="ghost"
                size="icon"
                class="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                @click="copyConfig"
              >
                <ILucideCopy class="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <!-- Recent Updates -->
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>History of updates deployed to {{ channelName }}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead class="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="update in recentUpdates" :key="update.id">
                    <TableCell class="font-medium"> v{{ update.version }} </TableCell>
                    <TableCell class="capitalize">{{ update.platform }}</TableCell>
                    <TableCell>{{ formatDate(update.created_at) }}</TableCell>
                    <TableCell>
                      <Badge :variant="update.active ? 'default' : 'secondary'">{{
                        update.active ? 'Yes' : 'No'
                      }}</Badge>
                    </TableCell>
                    <TableCell class="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="router.push(`/updates-bundles/${update.id}?type=${update.type}`)"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="recentUpdates.length === 0">
                    <TableCell colspan="5" class="text-center h-24 text-muted-foreground">
                      No updates found for this channel.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Placeholder for audits or logs -->
        <Card class="bg-muted/10 border-dashed h-full">
          <CardContent
            class="h-full flex items-center justify-center py-10 text-muted-foreground text-sm"
          >
            Activity logs coming soon
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

const { id: channelId } = defineProps<{ id: string }>()
const router = useRouter()

const { data: channels } = useChannelsQuery()
const { data: updates } = useUpdatesBundlesQuery()
const { data: devices } = useDevicesQuery()

const channel = computed(() => channels.value?.find((c) => String(c.id) === channelId))
const channelName = computed(() => channel.value?.name || 'Unknown Channel')

const channelBundles = computed(() => {
  return updates.value?.filter((u) => u.channel === channel.value?.name) || []
})

const channelDevices = computed(() => {
  return devices.value?.filter((d) => d.channel === channel.value?.name) || []
})

const recentUpdates = computed(() => {
  // Sort by date desc and take top 5
  return [...channelBundles.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

const latestVersion = computed(() => {
  if (recentUpdates.value.length === 0) return null
  return recentUpdates.value[0]?.version
})

const configSnippet = computed(() => {
  return `// Capacitor Config
{
  "appId": "${channel.value?.app_id || 'YOUR_APP_ID'}",
  "channel": "${channelName.value}",
  "autoUpdate": true
}`
})

const copyConfig = () => {
  navigator.clipboard.writeText(configSnippet.value)
  toast.success('Config copied')
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown date'
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

definePage({
  meta: {
    title: 'Channel Details - CapGO',
    category: 'channels',
  },
  props: true,
})
</script>
