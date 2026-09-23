import { reactive, unref } from 'vue'

const EMAIL = /^\S+@\S+\.\S+$/

export const isVisible = (field, values) => !field.visible || field.visible(values)

function validateField(field, value) {
  const empty = value === '' || value == null
  if (field.required && empty) return `${field.label} is required`
  if (empty) return ''
  if (field.type === 'email' && !EMAIL.test(value)) return 'Enter a valid email address'
  if (field.type === 'number' && Number(value) < (field.min ?? 0)) return `Must be at least ${field.min ?? 0}`
  if (field.minLength && String(value).length < field.minLength)
    return `Must be at least ${field.minLength} characters`
  return ''
}

/**
 * Minimal schema-driven form state shared by every form in the app.
 * `fields` may be a plain array or a ref/computed of field definitions.
 */
export function useForm(fields) {
  const values = reactive({})
  const errors = reactive({})

  function reset(initial = {}) {
    Object.keys(values).forEach((key) => delete values[key])
    Object.keys(errors).forEach((key) => delete errors[key])
    for (const field of unref(fields)) {
      const fallback = typeof field.default === 'function' ? field.default() : field.default
      values[field.name] = initial[field.name] ?? fallback ?? ''
    }
  }

  /** `extra(values)` may return { fieldName: message } for cross-field rules. */
  function validate(extra) {
    const found = {}
    for (const field of unref(fields)) {
      const message = isVisible(field, values) ? validateField(field, values[field.name]) : ''
      if (message) found[field.name] = message
    }
    Object.assign(found, { ...extra?.(values), ...found })
    Object.keys(errors).forEach((key) => delete errors[key])
    Object.assign(errors, found)
    return Object.keys(found).length === 0
  }

  reset()
  return { values, errors, validate, reset }
}
