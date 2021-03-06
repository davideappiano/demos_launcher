import { State, Action, StateContext } from '@ngxs/store';
import { OrgDelete, OrgDeleteProfile, OrgLaunchChrome, OrgSave, OrgsInstallChrome, OrgsLoadAll, OrgsReorder } from './actions';
import { OrgsStateModel, org_model, profile_model } from './model';
import { DbService, ElectronService } from '../../core/services';
import { Injectable } from '@angular/core';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { Guid } from 'guid-typescript';

@State<OrgsStateModel>({
  name: 'orgs',
  defaults: {
    version: 2,
    orgs: [],
    loading: false
  }
})
@Injectable({ providedIn: "root" })
export class OrgsState {

  constructor(private service: ElectronService, private db: DbService) { }

  @Action(OrgsLoadAll)
  getOrgs(ctx: StateContext<OrgsStateModel>): any {
    let orgs = this.db.getOrgs();

    if (orgs === undefined || !Array.isArray(orgs)) {
      console.log("Reset orgs");
      orgs = [];
    }

    // Check ids
    for (let index = 0; index < orgs.length; index++) {
      const org = orgs[index];
      if (org.id == null) {
        org.id = Guid.create().toString();
      }
    }

    ctx.setState(patch({
      orgs: orgs
    }));
  }

  @Action(OrgLaunchChrome)
  public launch(ctx: StateContext<OrgsStateModel>, { payload }: OrgLaunchChrome): void {
    this.service.launch(payload.org_name, {
      headless: false,
      use_homepage: true,
      profile: payload.profile
    });
  }

  @Action(OrgDeleteProfile)
  public org_delete_profile(ctx: StateContext<OrgsStateModel>, { name, profile }: OrgDeleteProfile): void {
    ctx.setState(patch<OrgsStateModel>({
      orgs: updateItem<org_model>(org => org.name === name, patch<org_model>({
        profiles: removeItem<profile_model>(p => p.innerName == profile.innerName)
      }))
    }));

    this.db.save(ctx.getState().orgs);
  }

  @Action(OrgSave)
  public org_save(ctx: StateContext<OrgsStateModel>, { payload }: OrgSave): void {

    const stateModel = ctx.getState();

    const org_idx = stateModel.orgs.findIndex(org => org.id === payload.id);

    ctx.setState((org_idx === -1) ?
      patch({ orgs: insertItem<org_model>(payload) }) :
      patch({ orgs: updateItem<org_model>(o => o.id === payload.id, payload) }));

    this.db.save(ctx.getState().orgs);
  }

  @Action(OrgDelete)
  public org_delete(ctx: StateContext<OrgsStateModel>, { name }: OrgDelete): void {

    ctx.setState(patch<OrgsStateModel>({
      orgs: removeItem<org_model>((org) => org.name === name)
    }));

    this.db.save(ctx.getState().orgs);
  }

  @Action(OrgsReorder)
  public reorder(ctx: StateContext<OrgsStateModel>, { updatedList }: OrgsReorder): void {
    // const stateModel = ctx.getState();
    ctx.setState(patch<OrgsStateModel>({
      orgs: updatedList
    }));

    this.db.save(ctx.getState().orgs);
  }

  @Action(OrgsInstallChrome)
  public install_org(ctx: StateContext<OrgsStateModel>, { name, profiles }: OrgsInstallChrome): void {
    ctx.patchState({ loading: true });

    this.service.install(name, profiles).then(() =>
      ctx.patchState({ loading: false }));
  }
}
