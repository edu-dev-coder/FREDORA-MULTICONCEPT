import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Session {
  id: string;
  primaryTemp: string;
  userEmail?: string;
  userName?: string;
}

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: Session[];
  onSubmit: (name: string, selectedSessionIds: string[]) => void;
}

const TEMP_BADGE_COLORS: Record<string, string> = {
  Sanguine: "bg-amber-100 text-amber-800 border-amber-200",
  Choleric: "bg-red-100 text-red-800 border-red-200",
  Melancholic: "bg-blue-100 text-blue-800 border-blue-200",
  Phlegmatic: "bg-green-100 text-green-800 border-green-200",
};

export function CreateTeamDialog({
  open,
  onOpenChange,
  sessions,
  onSubmit,
}: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(sessions.map((s) => s.id)));
  const deselectAll = () => setSelected(new Set());

  const canSubmit = teamName.trim().length > 0 && selected.size >= 2;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(teamName.trim(), Array.from(selected));
    setTeamName("");
    setSelected(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Select at least 2 team members to create a team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1 block">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Product Launch Team"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              type="button"
            >
              Select all
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deselectAll}
              type="button"
            >
              Deselect all
            </Button>
          </div>

          <div className="space-y-2">
            {sessions.map((session) => (
              <label
                key={session.id}
                className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  selected.has(session.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(session.id)}
                  onChange={() => toggle(session.id)}
                  className="h-4 w-4 rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.userName || session.userEmail || session.id}
                  </p>
                  {session.userEmail && session.userName && (
                    <p className="text-xs text-muted-foreground truncate">
                      {session.userEmail}
                    </p>
                  )}
                </div>
                <Badge
                  className={`text-xs flex-shrink-0 ${TEMP_BADGE_COLORS[session.primaryTemp] || ""}`}
                >
                  {session.primaryTemp}
                </Badge>
              </label>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full"
          >
            Create Team ({selected.size} members)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
