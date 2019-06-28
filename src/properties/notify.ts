import {Stage} from "@/constants";

export interface NotificationInfo<T> {
  newVal: T,
  oldVal?: T;
  stage?: Stage;
}

export class NotifyEvent<T> extends CustomEvent<NotificationInfo<T>> {
  constructor(newVal: T, oldVal?: T, stage?: Stage) {
    super("property-change", {
      detail: {
        newVal,
        oldVal,
        stage
      }
    });
  }
}
