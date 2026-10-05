/**
 * Fund OS autopilot CLIs: which Inbox store a module reads and writes.
 *
 * One store for all modules is the default; a module can have its own (its screen's store). Resolution, first hit wins:
 *   autopilot.stores.<module>   the module's own store URL
 *   autopilot.inboxStore        the fund's shared Inbox store
 *   autopilot.inboxStoreUrl     the older name of the shared store, still accepted
 * A value that is empty or a placeholder (starts with "<") counts as unset.
 */

import { ap, isPlaceholder } from "./common.mjs";

export const MODULE_NAME_RE = /^[a-z][a-z0-9-]*$/;

/** The store URL of a module, or null when neither the module nor the fund names one. */
export function storeUrl(cfg, moduleName) {
  const a = ap(cfg);
  const own = a.stores && typeof a.stores === "object" ? a.stores[moduleName] : undefined;
  for (const candidate of [own, a.inboxStore, a.inboxStoreUrl]) {
    if (!isPlaceholder(candidate)) return candidate.trim();
  }
  return null;
}
