
export interface ComponentExtension {
  register?();
  construct?();
  connect?();
  beforeRender?();
  afterRender?();
  disconnect?();
  destroy?();
}
