import { Injectable } from '@angular/core';
import * as jsforce from 'jsforce';
import { profile_model } from '../../../store/orgs/model';
// const { PassThrough } = require("stream");

export class SalesforceConnection {

  connected: boolean;
  connection: jsforce.Connection;

  private admin: profile_model;
  private jsforce: typeof jsforce;

  constructor(adminProfile: profile_model) {
    this.jsforce = window.require('jsforce');
    this.admin = adminProfile;
  }

  async connect() {
    this.connection = new this.jsforce.Connection({});

    try {
      await this.connection.login(this.admin.login, this.admin.pwd);
      this.connected = true;
    }
    catch {
      this.connected = false;
    }
  }

  async getDbUsers(): Promise<any> {

    const md = (await this.connection.metadata.read('CustomObject', ['User'])) as any;

    const conditions = md.fields.some(x => x.fullName === 'Key_User__c') ?
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { Key_User__c: true } : {};

    return this.connection
      .sobject('User')
      .find(
      // conditions in JSON object
      // conditions
    )
      .execute({}, (err, records) => {
        if (err) {
          return console.error(err);
        }
        return records;
      });
  }

  async getCommunities(): Promise<any> {
    return this.connection.sobject('Network')
      .find()
      .execute();
  }
}

@Injectable({
  providedIn: 'root',
})
export class SalesforceService {
  jsforce: typeof jsforce;

  constructor() {
    this.jsforce = window.require('jsforce');
  }

  async connection(adminProfile: profile_model): Promise<SalesforceConnection>  {
    const sfConnection = new SalesforceConnection(adminProfile);
    await sfConnection.connect();
    return sfConnection;
  }

  // async getDomain(adminProfile: profile_model): Promise<any> {
  //   const conn = new this.jsforce.Connection({});
  //   await conn.login(adminProfile.login, adminProfile.pwd);

  //   return await conn.sobject('Domain').find().execute()
  //     .then((domain: any[]) => domain[0].Domain);
  // }

  // async getCommunities(adminProfile: profile_model): Promise<any> {
  //   const conn = new this.jsforce.Connection({});
  //   await conn.login(adminProfile.login, adminProfile.pwd);

  //   return conn.sobject('Network')
  //     .find()
  //     .execute();
  // }

  // async getDbUsers(adminProfile: profile_model): Promise<any> {

  //   const c = new SalesforceConnection(adminProfile);
  //   await c.connect();

  //   const conn = new this.jsforce.Connection({});
  //   await conn.login(adminProfile.login, adminProfile.pwd);

  //   const md = (await conn.metadata.read('CustomObject', ['User'])) as any;

  //   const conditions = md.fields.some(x => x.fullName === 'Key_User__c') ?
  //     // eslint-disable-next-line @typescript-eslint/naming-convention
  //     { Key_User__c: true } : {};

  //   return conn
  //     .sobject('User')
  //     .find(
  //     // conditions in JSON object
  //     // conditions
  //   )
  //     .execute({}, function (err, records) {
  //       if (err) {
  //         return console.error(err);
  //       }
  //       return records;
  //     });
  // }
}
