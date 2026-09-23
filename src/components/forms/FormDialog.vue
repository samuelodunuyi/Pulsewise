<script setup>
import { ref, computed, watch } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import Dialog from '@/components/ui/Dialog.vue'
import Button from '@/components/ui/Button.vue'
import FormField from './FormField.vue'
import { forms } from '@/config/forms'
import { useForm, isVisible } from '@/composables/useForm'
import { useFormDialog } from '@/composables/useFormDialog'

// One dialog renders every create/edit form defined in config/forms.js.
const { dialog, closeForm, report, deleteRecord } = useFormDialog()

// Keep the last form around so content doesn't vanish during the close animation.
const shown = ref(null)
const config = computed(() => shown.value && forms[shown.value.key])
const context = computed(() => shown.value?.context ?? {})
const isEdit = computed(() => context.value.id != null)
const fields = computed(() => config.value?.sections.flatMap((s) => s.fields) ?? [])
const { values, errors, validate, reset } = useForm(fields)

watch(
  () => dialog.key,
  (key) => {
    if (!key) return
    shown.value = { key, context: dialog.context }
    const record = isEdit.value ? config.value.load?.(context.value) ?? {} : {}
    reset({ ...record, ...context.value.initial })
  }
)

const open = computed({
  get: () => !!dialog.key,
  set: (value) => !value && closeForm()
})

const resolve = (value) => (typeof value === 'function' ? value(context.value) : value)
const title = computed(() => resolve(isEdit.value ? config.value.editTitle ?? config.value.title : config.value.title))
const submitLabel = computed(() => (isEdit.value ? 'Save changes' : config.value.submitLabel ?? 'Save'))

function submit() {
  if (!validate(config.value.validate)) return
  if (report(config.value.submit({ ...values }, context.value))) closeForm()
}

async function onDelete() {
  if (await deleteRecord(shown.value.key, context.value)) closeForm()
}
</script>

<template>
  <Dialog
    v-if="config"
    v-model:open="open"
    :title="title"
    :description="isEdit ? undefined : config.description"
    content-class="max-w-2xl"
  >
    <template #icon><component :is="config.icon" class="size-4" /></template>

    <form id="record-form" class="space-y-6" novalidate @submit.prevent="submit">
      <fieldset v-for="section in config.sections" :key="section.title">
        <legend v-if="config.sections.length > 1" class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {{ section.title }}
        </legend>
        <div class="grid gap-4 sm:grid-cols-2">
          <template v-for="field in section.fields" :key="field.name">
            <FormField
              v-if="isVisible(field, values)"
              v-model="values[field.name]"
              :field="field"
              :values="values"
              :error="errors[field.name]"
              :id-prefix="shown.key"
            />
          </template>
        </div>
      </fieldset>
    </form>

    <template #footer>
      <Button v-if="isEdit && config.remove" variant="ghost" class="text-destructive hover:bg-destructive/10 hover:text-destructive sm:mr-auto" @click="onDelete">
        <Trash2 /> Delete
      </Button>
      <Button variant="outline" @click="closeForm">Cancel</Button>
      <Button type="submit" form="record-form">{{ submitLabel }}</Button>
    </template>
  </Dialog>
</template>
