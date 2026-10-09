import { parseApiError } from '@/api/errors'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** What is being rejected, e.g. the dish name; used in the dialog title. */
  subject: string
  onReject: (reason: string) => Promise<void>
}

/** Rejecting (also used to take an approved item down) needs a reason; approving needs no dialog. */
export function RejectDialog({ open, onOpenChange, subject, onReject }: Props) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit() {
    if (!reason.trim()) return setError('Nhập lý do để chủ quán biết cần sửa gì.')
    setError(null)
    setBusy(true)
    try {
      await onReject(reason.trim())
      setReason('')
      onOpenChange(false)
    } catch (failure) {
      setError(parseApiError(failure).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Từ chối {subject}</DialogTitle>
          <DialogDescription>
            Chủ quán sẽ thấy lý do này và có thể sửa rồi gửi lại.
          </DialogDescription>
        </DialogHeader>
        <FormField id="reason" label="Lý do" error={error ?? undefined}>
          <Textarea
            id="reason"
            rows={3}
            maxLength={1000}
            value={reason}
            aria-invalid={!!error}
            onChange={(event) => setReason(event.target.value)}
          />
        </FormField>
        <DialogFooter>
          <Button variant="outline" className="h-11 px-4" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button variant="destructive" className="h-11 px-4" disabled={busy} onClick={submit}>
            Từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
