import {Injectable} from '@angular/core';
import PocketBase from 'pocketbase';
import {Register} from "../_models/register";
import {Table} from "../_models/table";
import {Vote} from "../_models/vote";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class PokeerbaseService {
  pb = new PocketBase(environment.BACKEND_BASE_URI);
  constructor() {
  }

  public isLoggedIn() {
    return this.pb.authStore.isValid && this.pb.authStore.model!['verified'];
  }

  public async login(username: string, password: string) {
    return this.pb.collection('users').authWithPassword(
      username,
      password,
    ).then(res => {
      this.username = this.pb.authStore.model!['username'];
      return res;
    });
  }

  public async register(email: string, password: string) {
    const registerData: Register = {
      email: email,
      password: password,
      passwordConfirm: password,
      emailVisibility: false,
      name: "",
      username: ""
    }
    const auth = await this.pb.collection('users').create(registerData);
    await this.pb.collection('users').requestVerification(email);
    return auth;
  }

  public username = this.pb.authStore.model?.['username'];

  public async changeUsername(newUsername: string) {
    return await this.pb.collection('users').update(this.pb.authStore.model!['id'], {username: newUsername});
  }

  public logout() {
    this.pb.authStore.clear();
    console.log('logout')
  }

  public forgotPassword(email: string) {
    return this.pb.collection('users').requestPasswordReset(email);
  }

  // --------------------

  public async listMyTables() {
    const records = await this.pb.collection('tables').getFullList({
      expand: 'participants',
      fields: 'expand.participants.username,name,id,updated',
      sort: '-updated'
    });

    const tables: Table[] = records.map(table => {
      return {
        id: table['id'],
        name: table['name'],
        participants: table.expand!['participants'],
      }
    })

    return tables
  }

  public async joinTable(id: string) {
    const record: Table = await this.pb.collection('tables').getOne(id, {
      fields: 'name,options,participants',
    });

    record.participants.push(this.pb.authStore.model!['id'])

    const table = await this.pb.collection('tables').update(id, record, {fields: 'id,name,options,participants'}) as Table;

    const data: Vote = {
      "table": table.id!,
      "user": this.pb.authStore.model!['id'],
      "vote": '',
      "spectator": false
    };

    await this.createVoteEntry(data);
    return table;
  }

  public async createTable(name: string) {
    const record: Table = {
      name: name,
      options: undefined,
      participants: [this.pb.authStore.model!['id']]
    }

    const table = await this.pb.collection('tables').create(record, {fields: 'id,name,options,participants'}) as Table;

    const data: Vote = {
      "table": table.id!,
      "user": this.pb.authStore.model!['id'],
      "vote": '',
      "spectator": false
    };

    await this.createVoteEntry(data);
    return table;
  }

  public async hasAccessToTable(id: string) {
    return await this.pb.collection('tables').getFirstListItem(`id="${id}" && participants.id?="${this.pb.authStore.model!['id']}"`)
      .then(() => true).catch(() => false);
  }

  public async leaveTable(id: string) {
    const recordsToRemove = await this.pb.collection('votes').getFullList({
      filter: `table="${id}" && user="${this.pb.authStore.model!['id']}"`, fields: 'id'
    });

    recordsToRemove.forEach(record => {
      this.pb.collection('votes').delete(record.id);
    });

    const table = await this.pb.collection('tables').getOne(id, {
      fields: 'participants',
    });

    const updateParticipants = table['participants'];

    updateParticipants.splice(table['participants'].indexOf(this.pb.authStore.model!['id']), 1);

    if (updateParticipants.length === 0) {
      await this.pb.collection('tables').delete(id);
    } else {
      await this.pb.collection('tables').update(id, {participants: updateParticipants});
    }

    return this.listMyTables();
  }

  //----------

  private async createVoteEntry(createData: Vote) {
    return await this.pb.collection('votes').create(createData, {fields: "id"}) as { id: string };
  }

  public async voteOnTable(voteId: string, tableId: string, vote: string, spectator?: boolean) {
    const data: Vote = {
      "table": tableId,
      "user": this.pb.authStore.model!['id'],
      "vote": vote,
      "spectator": spectator
    };

    if (voteId === '') {
      const found = await this.pb.collection('votes').getFirstListItem(`table="${tableId}" && user="${this.pb.authStore.model!['id']}"`, {fields: "id"}) as { id: string }
      if (found) {
        voteId = found.id;
      }
    }

    return await this.pb.collection('votes').update(voteId, data, {fields: "id,spectator"}) as { id: string, spectator: boolean };
  }

  public realtimeVoting = this.pb.collection('votes')
  public unsubscribeVoting() {
    this.pb.collection('votes').unsubscribe();
  }

  public realtimeVotingReveal = this.pb.collection('tables')
  public unsubscribeVotingReveal() {
    this.pb.collection('tables').unsubscribe();
  }
  public async getCurrentVotes(tableId: string, sorted?: boolean) {
    return this.pb.collection('votes').getFullList({
      filter:`table="${tableId}"`,
      expand: 'user',
      fields: 'spectator,vote,expand.user.username',
      sort: sorted ? '+spectator,+vote' : '+spectator,+user'
    });
  }

  public revealVotes(tableId: string) {
    this.pb.collection('tables').update(tableId, {reveal: true});
  }

  public async resetVotes(tableId: string) {
    await this.pb.collection('tables').update(tableId, {reveal: false});
    const recordsToUpdate = await this.pb.collection('votes').getFullList({
      filter: `table="${tableId}"`, fields: 'id'
    });

    console.log(recordsToUpdate);
    recordsToUpdate.forEach(record => {
      this.pb.collection('votes').update(record.id, {vote: ''}, {fields: 'id'});
    })
  }
}
