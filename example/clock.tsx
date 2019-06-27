import {Autobound, Component, ComponentMixin, Prop, State, Terra, Validate, Watch} from "../src";

@ComponentMixin()
export class TickingMixin {

  @Prop({mutable: true}) _tickSpeed: number = 1000;

  _intervalId?: number;

  @Autobound()
  doTick() {}

  @Watch('_tickSpeed')
  watchTickSpeed(speed) {
    if (this._intervalId) clearInterval(this._intervalId);
    // @ts-ignore
    this._intervalId = speed ? setInterval(this.doTick, speed) : undefined;
  }

}


@Component()
export class HTMLTerraClockElement extends Terra(HTMLElement, TickingMixin) {

  @Prop({mutable: true}) date: Date = new Date();

  @Validate("date")
  validateDate(newVal: Date, oldVal?: Date, property?: string, type?: Function) {
    const val = new Date(newVal);
    val.setSeconds(0);
    if (val.getFullYear() > 2020) throw new RangeError("2020 not supported");
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
