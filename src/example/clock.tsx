import {Autobound, Component, Prop, State, Validate, Watch} from "..";


@Component()
export class HTMLTerraClockElement extends HTMLElement {

  @Prop({mutable: true}) date: Date = new Date();
  @Prop({mutable: true}) tick: boolean = false;

  @State() intervalId: number;

  @Watch('tick')
  watchTick(newVal) {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (newVal) {
      // @ts-ignore
      this.intervalId = setInterval(this.doTick, 1000);
    }
  }

  @Validate("date")
  validateDate(newVal: Date, oldVal?: Date, property?: string, type?: Function) {

    const val = new Date(newVal);
    val.setSeconds(0);
    if (val.getFullYear() > 2020) throw new RangeError("2020 ist nicht supported");
    return val;
  }

  @Autobound()
  doTick() {
    this.date = new Date();
  }

  render() {
    return <div class="terra-clock">
      <span id="hours">{this.date.getHours()}</span>
      <span id="minutes">{this.date.getMinutes()}</span>
      <span id="seconds">{this.date.getSeconds()}</span>
    </div>;
  }

}
