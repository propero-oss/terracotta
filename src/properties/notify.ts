import {Stage} from "@/constants";

export interface NotificationInfo<T> {
  newVal: T,
  oldVal?: T;
  stage?: Stage;
  property: string | symbol
}

export class NotifyEvent<T> extends CustomEvent<NotificationInfo<T>> {
  constructor(property: string | symbol, newVal: T, oldVal?: T, stage?: Stage) {
    super("property-change", {
      detail: {
        property,
        newVal,
        oldVal,
        stage
      },
      bubbles: true
    });
  }
}
