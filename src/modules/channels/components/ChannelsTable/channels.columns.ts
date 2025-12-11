import type { ColumnDef } from '@tanstack/vue-table'
import type { Channel } from '../../types/channels.types'
import { Checkbox } from '@/components/ui/checkbox'
import { h } from 'vue'
import DataTableColumnHeader from '@/components/common/DataTable/components/DataTableColumnHeader.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2 } from 'lucide-vue-next'

export const channelsColumns: ColumnDef<Channel>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
        onClick: (e: Event) => e.stopPropagation(),
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
        onClick: (e: Event) => e.stopPropagation(),
      }),
    enableSorting: false,
    enableHiding: false,
    meta: {
      disableDragging: true,
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Name' }),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
  },
  {
    accessorKey: 'platform',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Platform' }),
    cell: ({ row }) => {
      const platform = row.getValue('platform') as string
      return h('div', { class: 'flex items-center gap-2' }, [
        platform === 'android'
          ? h('img', { src: 'https://api.iconify.design/logos:android-icon.svg', class: 'w-4 h-4' })
          : platform === 'ios'
            ? h('img', { src: 'https://api.iconify.design/logos:apple.svg', class: 'w-4 h-4' })
            : h('span', 'Web'),
      ])
    },
    meta: {
      filterVariant: 'select',
      faceted: true,
    },
  },
  {
    accessorKey: 'app_id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'App ID' }),
    cell: ({ row }) => h('div', { class: 'truncate max-w-[200px]' }, row.getValue('app_id')),
  },
  {
    accessorKey: 'bundle_count',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Bundles' }),
    cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('bundle_count') || 0),
  },
  {
    accessorKey: 'device_count',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Devices' }),
    cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('device_count') || 0),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Created At' }),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return h('div', date.toLocaleDateString())
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      return h(
        DropdownMenu,
        {},
        {
          default: () => [
            h(
              DropdownMenuTrigger,
              { asChild: true, onClick: (e: Event) => e.stopPropagation() },
              {
                default: () =>
                  h(Button, { variant: 'ghost', size: 'icon', class: 'h-8 w-8' }, () => [
                    h(MoreHorizontal, { class: 'h-4 w-4' }),
                    h('span', { class: 'sr-only' }, 'Open menu'),
                  ]),
              },
            ),
            h(
              DropdownMenuContent,
              { align: 'end' },
              {
                default: () => [
                  h(DropdownMenuLabel, {}, () => 'Actions'),
                  h(
                    DropdownMenuItem,
                    {
                      onClick: () => navigator.clipboard.writeText(row.original.id),
                    },
                    () => 'Copy ID',
                  ),
                  h(DropdownMenuSeparator),
                  h(
                    DropdownMenuItem,
                    {
                      class: 'text-destructive',
                      onClick: (e: any) => {
                        e.stopPropagation()
                        // Emit delete event logic here or through a global bus/store
                        // Since we can't emit easily from here, we rely on the component using the table to handle row clicks
                        // or we can use the table's meta options to pass callbacks.
                        // For now, simpler to leave it as a visual placeholder or simple action.
                        // However, to match updates-bundles, we should probably facilitate delete.
                        // Let's assume the Row Click handles the main "View/Edit" action.
                      },
                    },
                    () => [h(Trash2, { class: 'mr-2 h-4 w-4' }), 'Delete'],
                  ),
                ],
              },
            ),
          ],
        },
      )
    },
    enableHiding: false,
    meta: {
      disableDragging: true,
    },
  },
]
