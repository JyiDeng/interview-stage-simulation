declare module "@met4citizen/talkinghead" {
  export class TalkingHead {
    constructor(node: HTMLElement, options?: Record<string, unknown>);
    showAvatar(avatar: Record<string, unknown>): Promise<void>;
    setMood(mood: string): void;
    lookAtCamera(durationMs: number): void;
    stop(): void;
  }
}
