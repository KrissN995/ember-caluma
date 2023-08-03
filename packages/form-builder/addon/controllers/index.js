import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class IndexController extends Controller {
  @service router;

  queryParams = ["search", "category"];

  @tracked search = "";
  @tracked category = "active";
  @tracked oldName='';
  @tracked oldSlug='';
  @tracked visible=false;

  @action
  newForm() {
    this.router.transitionTo("new");
  }

  @action
  editForm({ slug }) {
    this.router.transitionTo("edit", slug);
  }

  @action
  closeForm(){
    this.visible=false;
    console.log('did it enter the close form');
  }

  @action
  copyForm({slug, name}){
  this.oldName=name;
  this.oldSlug=slug;
  this.visible=true;
  console.log('did it update the value', this.visible);
  }
}
