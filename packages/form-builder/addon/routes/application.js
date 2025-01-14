import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { t } from "ember-intl";

import { navigationTitle } from "@projectcaluma/ember-form-builder/decorators";

export default class ApplicationRoute extends Route {
  @service intl;

  @navigationTitle
  @t("caluma.form-builder.form.allForms")
  title;
}
