<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <StoreSwitcher :stores="apps" />
    </SidebarHeader>
    <SidebarContent class="flex flex-col justify-between items-start h-full">
      <div class="w-full">
        <NavMain :items="storeDashboard" group-name="Dashboard" />
        <NavMain :items="storeEssentials" group-name="Modules" />
      </div>
      <NavMain :items="storeSettings" group-name="Settings" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="navUser" />
    </SidebarFooter>
  </Sidebar>
</template>
<script setup lang="ts">
import SidebarHeader from '@/components/ui/sidebar/SidebarHeader.vue'
import { storeToRefs } from 'pinia'
import NavMain from './NavMain.vue'
import NavUser from './NavUser.vue'
import StoreSwitcher from './StoreSwitcher.vue'

import type { SidebarProps } from '@/components/ui/sidebar'
import {
  Home,
  LifeBuoy,
  Settings,
  GitBranch,
  Smartphone,
  GraduationCap,
  Rocket,
  Radio,
} from 'lucide-vue-next'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset',
})

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const navUser = {
  name: user.value?.email?.split('@')[0] ?? '',
  email: user.value?.email ?? '',
  avatar: '/avatars/shadcn.jpg',
}

const apps = [
  {
    name: 'Vuena',
    logo: Smartphone,
    plan: 'Enterprise',
  },
  {
    name: 'E-lmni',
    logo: GraduationCap,
    plan: 'Startup',
  },
  {
    name: 'Vueta',
    logo: Rocket,
    plan: 'Free',
  },
]

const storeDashboard = [
  {
    title: 'Dashboard',
    url: '/dashboard/',
    icon: Home,
    isActive: true,
  },
]
const storeEssentials = [
  {
    title: 'Updates & Bundles',
    url: '/updates-bundles',
    icon: GitBranch,
    items: [
      {
        title: 'All Updates & Bundles',
        url: '/updates-bundles',
      },
      {
        title: 'Upload Update/Bundle',
        url: '/updates-bundles/upload',
      },
    ],
  },
  {
    title: 'Channels',
    url: '/channels',
    icon: Radio,
    items: [
      {
        title: 'All Channels',
        url: '/channels',
      },
    ],
  },
  {
    title: 'Devices',
    url: '/devices',
    icon: Smartphone,
    items: [
      {
        title: 'All Devices',
        url: '/devices',
      },
    ],
  },
]

const storeSettings = [
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    items: [
      {
        title: 'Profile',
        url: '/settings',
      },
      {
        title: 'Store Settings',
        url: '/settings/store',
      },
      {
        title: 'Business Hours',
        url: '/settings/business-hours',
      },
      {
        title: 'Delivery Zone',
        url: '/settings/delivery-zone',
      },
      {
        title: 'Payment Methods',
        url: '/settings/payments',
      },
      {
        title: 'Notifications',
        url: '/settings/notifications',
      },
    ],
  },
  {
    title: 'Support',
    url: '/support',
    icon: LifeBuoy,
    items: [
      {
        title: 'FeedBack',
        url: '/support/feedback',
      },
      {
        title: 'FAQ',
        url: '/support/faq',
      },
      {
        title: 'Resources',
        url: '/support/resources',
      },
    ],
  },
]
</script>
