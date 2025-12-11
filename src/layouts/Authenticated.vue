<template>
  <SidebarProvider>
    <AppSidebar :side="langDirection === 'ltr' ? 'left' : 'right'" />
    <SidebarInset>
      <SideBarMainHeader :search-command-ref="searchCommandRef" />
      <div
        class="flex flex-col gap-1 p-2 lg:p-6 overflow-y-scroll"
        style="height: calc(100vh - (64px + 16px))"
      >
        <RouterView v-slot="{ Component, route }">
          <RouteTransition :route-path="route.path">
            <component :is="Component" :key="route.path" />
          </RouteTransition>
        </RouterView>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import AppSidebar from './Authenticated/AppSidebar.vue'
import SearchCommand from './Authenticated/SearchCommand.vue'
import SideBarMainHeader from './Authenticated/SideBarMainHeader.vue'

const languageStore = useLanguageStore()
const { langDirection } = storeToRefs(languageStore)

const searchCommandRef = ref<InstanceType<typeof SearchCommand> | null>(null)
</script>
