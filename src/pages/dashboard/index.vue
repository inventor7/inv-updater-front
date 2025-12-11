<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-heading font-bold">Dashboard</h1>
      <p class="text-muted-foreground">
        Welcome back! Here's what's happening with your store today.
      </p>
    </div>

    <!-- Stats Cards -->
    <div v-if="isLoadingStats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card v-for="i in 4" :key="i">
        <CardContent class="px-6 py-3">
          <div class="space-y-2">
            <Skeleton class="h-4 w-[100px]" />
            <Skeleton class="h-8 w-[60px]" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="statsError" class="p-6 text-center text-red-500">
      Failed to load dashboard statistics.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card v-for="(stat, index) in dashboardStats" :key="index">
        <CardContent class="px-6 py-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{{ stat.title }}</p>
              <p class="text-2xl font-bold">{{ stat.value }}</p>
            </div>
            <div class="p-3 rounded-full bg-foreground/10">
              <component :is="stat.icon" class="h-6 w-6" :class="stat.color" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content Area -->
    <Tabs defaultValue="analytics" class="space-y-6">
      <TabsList>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="updates">Recent Updates</TabsTrigger>
      </TabsList>

      <TabsContent value="analytics">
        <div class="flex w-full">
          <UpdateDownloadsChart
            :data="downloadChartData"
            title="Update Downloads"
            description="Weekly download trends"
            class="w-full"
          />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 mt-6 gap-6">
          <ChannelDistributionChart
            :data="channelDistributionData"
            title="Channel Distribution"
            description="Distribution across channels"
          />
          <DeviceDistributionChart
            :data="deviceDistributionData"
            title="Device Distribution"
            description="Platform breakdown"
          />
        </div>
      </TabsContent>
      <TabsContent value="overview" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- System Status Card -->
          <Card class="lg:col-span-1">
            <CardHeader>
              <CardTitle class="font-heading">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">Server Status</span>
                  <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200">
                    Online
                  </Badge>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">API Version</span>
                  <span class="text-sm text-muted-foreground">v1.0.0</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">Database</span>
                  <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200">
                    Connected
                  </Badge>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">Storage</span>
                  <span class="text-sm text-muted-foreground">
                    {{ ((storageUsed / totalStorage) * 100).toFixed(1) }}% of
                    {{ formatBytes(totalStorage) }}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Quick Actions Card -->
          <Card class="lg:col-span-2">
            <CardHeader>
              <CardTitle class="font-heading">Quick Actions</CardTitle>
              <CardDescription>Access common functions quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 gap-4">
                <Button variant="outline" class="h-20 flex flex-col items-center justify-center">
                  <Package class="h-6 w-6 mb-2" />
                  <span>Manage Bundles</span>
                </Button>
                <Button variant="outline" class="h-20 flex flex-col items-center justify-center">
                  <Smartphone class="h-6 w-6 mb-2" />
                  <span>View Devices</span>
                </Button>
                <Button variant="outline" class="h-20 flex flex-col items-center justify-center">
                  <Radio class="h-6 w-6 mb-2" />
                  <span>Manage Channels</span>
                </Button>
                <Button variant="outline" class="h-20 flex flex-col items-center justify-center">
                  <Download class="h-6 w-6 mb-2" />
                  <span>Upload Update</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Recent Activity Section -->
        <Card>
          <CardHeader>
            <CardTitle class="font-heading">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="isLoadingActivity" class="flex justify-center p-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <div v-else-if="activityError" class="p-4 text-center text-red-500">
              Failed to load recent activity.
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="(activity, index) in recentActivity"
                :key="index"
                class="flex items-start space-x-4 p-4 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors"
              >
                <div :class="`p-2 rounded-full ${activity.iconBg}`">
                  <component :is="activity.icon" :class="`h-5 w-5 ${activity.iconColor}`" />
                </div>
                <div class="flex-1 space-y-1">
                  <p class="text-sm font-medium">{{ activity.title }}</p>
                  <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
                  <p class="text-xs text-muted-foreground">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="updates">
        <Card>
          <CardHeader>
            <CardTitle class="font-heading">Recent Updates</CardTitle>
            <CardDescription>Latest bundle and native updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="isLoadingUpdates" class="flex justify-center p-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <div v-else-if="updatesError" class="p-4 text-center text-red-500">
              Failed to load updates.
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="(update, index) in recentUpdates"
                :key="index"
                class="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors"
              >
                <div class="flex items-center space-x-4">
                  <div
                    :class="`p-2 rounded-full ${
                      update.type === 'bundle'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`"
                  >
                    <component
                      :is="update.type === 'bundle' ? Package : Smartphone"
                      class="h-5 w-5"
                    />
                  </div>
                  <div>
                    <p class="font-medium">{{ update.version }}</p>
                    <div class="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span class="capitalize">{{ update.platform }}</span>
                      <span>•</span>
                      <span class="capitalize">{{ update.channel }}</span>
                      <span>•</span>
                      <span>{{ update.environment }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-sm text-muted-foreground">{{ update.createdAt }}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Package, Smartphone, Download, Radio, Upload, Activity } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  UpdateDownloadsChart,
  DeviceDistributionChart,
  ChannelDistributionChart,
} from '@/modules/statistics'

const { data: statsData, isLoading: isLoadingStats, error: statsError } = useDashboardStatsQuery()
// const { data: statsDataDetailed, isLoading: isLoadingDetailedStats } = useDashboardStatsDataQuery()

// Mock recent activity data
const recentActivity = ref([
  {
    title: 'New bundle uploaded',
    description: 'v2.1.0 for web platform',
    time: '2 minutes ago',
    icon: Upload,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    title: 'Device connected',
    description: 'New iOS device registered',
    time: '1 hour ago',
    icon: Smartphone,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  {
    title: 'Channel updated',
    description: 'Stable channel settings modified',
    time: '3 hours ago',
    icon: Radio,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
  },
  {
    title: 'System maintenance',
    description: 'Database backup completed',
    time: '1 day ago',
    icon: Activity,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
])

// Mock recent updates data
const recentUpdates = ref([
  {
    version: 'v2.1.0',
    type: 'bundle',
    platform: 'web',
    channel: 'stable',
    environment: 'prod',
    createdAt: '2025-01-15',
  },
  {
    version: 'v3.0.1',
    type: 'native',
    platform: 'android',
    channel: 'beta',
    environment: 'staging',
    createdAt: '2025-01-14',
  },
  {
    version: 'v1.8.5',
    type: 'bundle',
    platform: 'web',
    channel: 'dev',
    environment: 'dev',
    createdAt: '2025-01-13',
  },
  {
    version: 'v4.2.0',
    type: 'native',
    platform: 'ios',
    channel: 'stable',
    environment: 'prod',
    createdAt: '2025-01-12',
  },
])

// System status mock data
const storageUsed = ref(2.5 * 1024 * 1024 * 1024) // 2.5GB
const totalStorage = ref(10 * 1024 * 1024 * 1024) // 10GB

// Loading states for new sections
const isLoadingActivity = ref(false)
const activityError = ref(null)
const isLoadingUpdates = ref(false)
const updatesError = ref(null)

// Format bytes helper function
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Chart data - will be populated from API when available
const downloadChartData = computed(() => {
  // Use mock data for now - would come from API in real implementation
  return [
    { date: new Date('2024-04-01'), desktop: 222, mobile: 150 },
    { date: new Date('2024-04-02'), desktop: 97, mobile: 180 },
    { date: new Date('2024-04-03'), desktop: 167, mobile: 120 },
    { date: new Date('2024-04-04'), desktop: 242, mobile: 260 },
    { date: new Date('2024-04-05'), desktop: 373, mobile: 290 },
    { date: new Date('2024-04-06'), desktop: 301, mobile: 340 },
    { date: new Date('2024-04-07'), desktop: 245, mobile: 180 },
  ]
})

const deviceDistributionData = computed(() => {
  // Use mock data for now - would come from API in real implementation
  return [
    { platform: 'android', downloads: 350 },
    { platform: 'ios', downloads: 280 },
    { platform: 'web', downloads: 190 },
  ]
})

const channelDistributionData = computed(() => {
  // Use mock data for now - would come from API in real implementation
  return [
    { channel: 'stable', count: 450, fill: 'var(--color-chart-1)' },
    { channel: 'beta', count: 300, fill: 'var(--color-chart-2)' },
    { channel: 'dev', count: 180, fill: 'var(--color-chart-3)' },
  ]
})

const dashboardStats = computed(() => {
  if (!statsData.value) return []

  return [
    {
      title: 'Total Bundles',
      value: statsData.value.bundles_count ?? 0,
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Active Devices',
      value: statsData.value.devices_count ?? 0,
      icon: Smartphone,
      color: 'text-green-600',
    },
    {
      title: 'Update Downloads',
      value: statsData.value.downloads_count ?? 0,
      icon: Download,
      color: 'text-purple-600',
    },
    {
      title: 'Active Channels',
      value: statsData.value.channels_count ?? 0,
      icon: Radio,
      color: 'text-orange-600',
    },
  ]
})

definePage({
  meta: {
    title: 'Dashboard - CapGO Admin',
    description: 'Monitor your self-hosted CapGO instance.',
  },
  props: true,
})
</script>
