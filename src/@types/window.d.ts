import type { SceneObject } from '@grafana/scenes';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __grafanaSceneContext?: SceneObject;
  }
}

export {};
