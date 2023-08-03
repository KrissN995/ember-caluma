import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import FormValidations from "../../validations/form";
import copyFormMutation from "@projectcaluma/ember-form-builder/gql/mutations/copy-form.graphql";
import { queryManager } from "ember-apollo-client";

export default class CopyFormComponent extends Component {
    @tracked name = '';
    @tracked slug = '';
    @service router;
    @queryManager apollo;
    Validations = FormValidations;
    // constructor() { }
    get data() {
        return {
            name: this.args.oldName,
            slug: this.args.oldSlug
        }
    }

    @action
    async copyForm(changeset) {
        const form = await this.apollo.mutate(
            {
                mutation: copyFormMutation,
                variables: {
                    input: {
                        name: changeset.get("name"),
                        slug: changeset.get("slug"),
                        source: this.args.oldSlug
                    },
                },
            },
            "copyForm.form",
        );
        console.log('form slug', form.slug);
        this.args.onCloseForm();
        this.router.transitionTo("edit", form.slug);
    }

    @action
    cancel() {
        this.visible = false;
    }

    @action
    updateName(newName) {
        this.name = newName;
    }

    @action
    updateSlug(newSlug) {
        this.slug = newSlug;
    }
}