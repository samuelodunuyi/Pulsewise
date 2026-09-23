<script setup>
import { computed } from 'vue'
import Label from '@/components/ui/Label.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Textarea from '@/components/ui/Textarea.vue'
import { cn } from '@/lib/utils'

/** Renders any field definition from config/forms.js (or an auth page). */
const props = defineProps({
  field: { type: Object, required: true },
  error: String,
  idPrefix: { type: String, default: 'field' },
  values: { type: Object, default: () => ({}) } // whole form, for options that depend on other fields
})
const model = defineModel({ type: [String, Number], default: '' })

const id = computed(() => `${props.idPrefix}-${props.field.name}`)
const options = computed(() =>
  typeof props.field.options === 'function' ? props.field.options(props.values) : props.field.options ?? []
)
const describedBy = computed(() => (props.error ? `${id.value}-error` : undefined))
</script>

<template>
  <div :class="cn('space-y-2', field.span === 2 && 'sm:col-span-2')">
    <Label :for="field.type === 'radio' ? undefined : id" :id="`${id}-label`">
      {{ field.label }}<span v-if="field.required" class="text-destructive" aria-hidden="true"> *</span>
    </Label>

    <Select
      v-if="field.type === 'select'"
      :id="id"
      v-model="model"
      :options="options"
      :placeholder="field.placeholder ?? `Select ${field.label.toLowerCase()}`"
      :aria-invalid="!!error"
      :aria-describedby="describedBy"
    />

    <Textarea
      v-else-if="field.type === 'textarea'"
      :id="id"
      v-model="model"
      :placeholder="field.placeholder"
      :aria-invalid="!!error"
      :aria-describedby="describedBy"
    />

    <div v-else-if="field.type === 'radio'" role="radiogroup" :aria-labelledby="`${id}-label`" class="flex gap-2">
      <label
        v-for="opt in options"
        :key="opt"
        :class="
          cn(
            'flex h-9 flex-1 cursor-pointer items-center justify-center rounded-lg border text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
            model === opt ? 'border-primary bg-primary/10 font-medium text-primary' : 'border-input hover:bg-muted'
          )
        "
      >
        <input v-model="model" type="radio" class="sr-only" :name="id" :value="opt" />
        {{ opt }}
      </label>
    </div>

    <Input
      v-else
      :id="id"
      v-model="model"
      :type="field.type ?? 'text'"
      :placeholder="field.placeholder"
      :autocomplete="field.autocomplete"
      :aria-invalid="!!error"
      :aria-describedby="describedBy"
    />

    <p v-if="error" :id="`${id}-error`" class="text-xs font-medium text-destructive">{{ error }}</p>
    <p v-else-if="field.hint" class="text-xs text-muted-foreground">{{ field.hint }}</p>
  </div>
</template>
