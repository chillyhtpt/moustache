export type UpdateChannel = "stable" | "beta" | "nightly";

export type UpdateState =
  "idle" | "checking" | "available" | "downloading" | "ready" | "upToDate" | "error";

export interface ReleaseVersion {
  version: string;
  releaseDate: string;
  channel: UpdateChannel;
  title: string;
  highlights: string[];
  changelog: string;
  isCurrent: boolean;
  downloadSize: string;
}
