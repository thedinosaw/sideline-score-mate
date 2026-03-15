import { Button } from '@/components/ui/button';

interface NewMatchDialogProps {
  onSaveAndNew: () => void;
  onDiscardAndNew: () => void;
  onCancel: () => void;
}

export function NewMatchDialog({ onSaveAndNew, onDiscardAndNew, onCancel }: NewMatchDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30" onClick={onCancel}>
      <div className="bg-background rounded-2xl p-6 mx-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-foreground text-center">Start New Match?</h2>
        <p className="text-sm text-muted-foreground text-center">What would you like to do with the current match?</p>
        <Button onClick={onSaveAndNew} className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground">
          Save &amp; Start New
        </Button>
        <Button variant="outline" onClick={onDiscardAndNew} className="w-full h-12 text-foreground border-border">
          Discard &amp; Start New
        </Button>
        <Button variant="ghost" onClick={onCancel} className="w-full h-12 text-muted-foreground">
          Cancel
        </Button>
      </div>
    </div>
  );
}
