import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { forms } from '@/config/forms'
import { confirm } from './useConfirm'
import { toast } from './useToast'

// Drives the single <FormDialog>. `context` carries { id } when editing and
// { initial } to prefill fields when creating (e.g. a patient's new appointment).
const dialog = reactive({ key: null, context: {} })

export function useFormDialog() {
  const router = useRouter()

  /** Toast a form result and follow its redirect. Returns false on error. */
  function report(result) {
    if (!result) return true
    if (result.error) {
      toast({ title: "Couldn't do that", description: result.error, variant: 'destructive' })
      return false
    }
    toast({ title: result.title, description: result.description, variant: 'success' })
    if (result.to) router.push(result.to)
    return true
  }

  /** Confirm, then delete through the form's own remove() — usable from any table or page. */
  async function deleteRecord(key, context) {
    const form = forms[key]
    if (!(await confirm(form.confirmRemove(context)))) return false
    return report(form.remove(context))
  }

  return {
    dialog,
    openForm(key, context = {}) {
      dialog.context = context
      dialog.key = key
    },
    closeForm() {
      dialog.key = null
    },
    report,
    deleteRecord
  }
}
