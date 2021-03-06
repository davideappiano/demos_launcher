import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { IpcRenderer } from "electron";
import * as fs from "fs";
import { Config, SupportedBrowsers } from "../../../store/config/model";
import { OrgHelper, OrgsStateModel, profile_model } from "../../../store/orgs/model";

export interface launch_options {
  profile: profile_model | null,
  headless: boolean | false,
  use_homepage: boolean | true
}

const sleep = (waitTimeInMs: number) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

@Injectable({
  providedIn: "root",
})
export class ElectronService {
  private ipc: IpcRenderer;
  fs: typeof fs;

  constructor(private store: Store) {
    this.ipc = (<any>window).require('electron').ipcRenderer;
    this.fs = window.require("fs");
  }

  private local_config(org: string): { orgs_base: string; org_name: string; } {
    const org_chrome = org.replace(/\s/g, "");

    const config = {
      orgs_base: process.env["HOME"] + "/.demos_launcher/Orgs",
      org_name: org_chrome,
    };

    return config;
  }

  launch(org: string, opts?: launch_options): void {

    const store = this.store.selectSnapshot<OrgsStateModel>(state => state.orgs);
    const global_config = this.store.selectSnapshot<Config>(state => state.config);
    const org_obj = store.orgs.find(o => o.name === org);

    const admin = OrgHelper.getAdmin(org_obj); // org_obj.profiles.find(p => p.name === org_obj.admin);

    opts = opts ?? {
      profile: admin,
      use_homepage: true,
      headless: false,
    };

    const config = this.local_config(org);

    opts.profile.innerName = opts.profile.innerName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const browser_path =
      global_config.browser == SupportedBrowsers.Chromium
        ? "/Applications/Google Chrome Canary.app"
        : "/Applications/Google Chrome.app";

    const loginPage = global_config.useMiddleware ?
      'https://clicktologin.herokuapp.com/' :
      'https://login.salesforce.com/login.jsp';


    // // TODO : Repoace with community
    // if(opts.profile.login !== undefined && opts.profile.loginType !== 'Standard') {
    //   loginPage  = org_obj.domain + '/' + opts.profile.loginType;
    // }

    const siteUser = opts.profile.login.toString();

    let login = opts.profile.login;
    let pwd = opts.profile.pwd;

    if (opts.profile.login !== undefined && opts.profile.loginType !== 'Standard') {
      login = admin.login;
      pwd = admin.pwd;
    }
    const site = (opts.profile.login !== undefined && opts.profile.loginType !== 'Standard') ?
      `&siteuser=${siteUser}&site=${opts.profile.loginType}` : '';

    const homepage = `${loginPage}?un=${login}&pw=${pwd}`;

    const launch_path = `open -j -n "${browser_path}" \
      --args --user-data-dir=${config.orgs_base}/${config.org_name}/Chrome \
      --profile-directory="${opts.profile.innerName}" \
      --no-first-run \
      --no-default-browser-check`;

    const launch_command =
      launch_path +
      (opts.use_homepage ? ` '${homepage}'` : "") +
      (opts.headless ? "  --window-position=0,0 --window-size=1,1" : "");

    this.ipc.send('launch', launch_command);
  }

  kill(org: string): void {
    const org_chrome = org.replace(/\s/g, "");

    try {
      this.ipc.send('launch', `pkill -f '${org_chrome}'`);
    }
    catch (err) {
      // No need to take care of the error
    }
  }

  async install(org: string, profiles: profile_model[]): Promise<void> {
    this.kill(org);

    await sleep(2000);

    const config = this.local_config(org);
    const dir = `${config.orgs_base}/${config.org_name}`;
    this.fs.rmdirSync(dir, { recursive: true });


    // Install first Chrome profile
    const profile = profiles[0];

    console.log("install profile: " + profile.name);

    this.launch(org, {
      profile: profile,
      headless: false,
      use_homepage: false
    });

    await sleep(5000);

    this.kill(org);

    const fn = `${config.orgs_base}/${config.org_name}/Chrome/Local State`;

    try {
      const obj = JSON.parse(this.fs.readFileSync(fn, "utf8"));
      const infoCache = obj.profile.info_cache;

      const reference_profile = infoCache[profiles[0].innerName];

      const new_infoCache = {};

      for (let i = 0; i < profiles.length; i++) {

        const profile = profiles[i];

        new_infoCache[profile.innerName] = {};
        Object.assign(new_infoCache[profile.innerName], reference_profile);
        new_infoCache[profile.innerName].name = profile.name;
      }

      obj.profile.info_cache = new_infoCache;

      await sleep(3000);

      this.fs.writeFileSync(fn, JSON.stringify(obj), "utf8");
    } catch (err) {
      console.log(err);
    }
  }
}
