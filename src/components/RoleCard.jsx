import { Button } from "./index.js";
import { Trash, Star } from "lucide-react";

function RoleCard({
  role,
  plan,
  keywords = [],
  channelIds = [],
  onActivate,
  onDelete,
  activeRoleId,
  activating = false,
  deleting = false,
}) {
  const isActive = role.id === activeRoleId;

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm transition-all ${
        isActive
          ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-[#1e1e2e]"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-[#1c1c1c]"
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold text-[#2e2e2e] dark:text-[#fefefe]">
            {role.name}{" "}
            {isActive && (
              <span className="text-sm text-indigo-500">(Active)</span>
            )}
          </h4>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Keywords:</strong>{" "}
            {keywords.length > 0 ? keywords.join(", ") : "None"}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Channel IDs:</strong>{" "}
            {channelIds.length > 0 ? channelIds.join(", ") : "None"}
          </div>
        </div>

        <div className="flex gap-2 pt-2 sm:pt-0">
          {!isActive && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onActivate(role)}
              disabled={activating || deleting}
              className="flex items-center justify-center gap-1"
            >
              {activating ? (
                <span className="text-sm">Activating...</span>
              ) : (
                <>
                  <Star className="h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
          )}

          {plan !== "lite" && plan !== "free" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(role)}
              disabled={activating || deleting}
              className="flex items-center justify-center gap-1"
            >
              {deleting ? (
                <span className="text-sm">Deleting...</span>
              ) : (
                <>
                  <Trash className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleCard;
