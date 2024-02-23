import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {PokeerbaseService} from "../../_services/pokeerbase.service";
import {Vote} from "../../_models/vote";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgSwitchCase,
    NgSwitch,
    RouterLink,
    NgSwitchDefault
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnDestroy {
  votableValues = ['0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '∞', '?']
  private readonly tableId = '' // private
  vote = ''
  spectator = false
  private voteId = ''
  currentVotes: Vote[] = [];
  votesRevealed = false;

  constructor(private route: ActivatedRoute, private pb: PokeerbaseService) {
    this.tableId = this.route.snapshot.params['tableId'];
    this.pb.voteOnTable(this.voteId, this.tableId, '').then(result => {
      this.voteId = result.id
      this.spectator = result.spectator
    });
    this.refreshVotes();
    this.pb.realtimeVoting.subscribe('*', (e) => {
      if (e.record['table'] !== this.tableId) {
        return
      }
      this.refreshVotes();
    }, {
      expand: 'user',
      fields: 'spectator,vote,expand.user.username,table'
    });

    this.pb.realtimeVotingReveal.subscribe(this.tableId, (e) => {
      if (!this.votesRevealed && e.record['reveal'] === true) {
        this.votesRevealed = e.record['reveal'];
      }
      if (this.votesRevealed && e.record['reveal'] === false) {
        this.votesRevealed = e.record['reveal'];
        this.vote = ''
      }
      this.refreshVotes();
    }, {
      fields: 'reveal'
    });
  }

  public voteCard(value: string) {
    if (this.votesRevealed) {
      return
    }

    if (this.vote !== value) {
      this.vote = value;
      this.pb.voteOnTable(this.voteId, this.tableId, this.vote).then(result => this.voteId = result.id);
    } else {
      this.vote = '';
      this.pb.voteOnTable(this.voteId, this.tableId, this.vote).then(result => this.voteId = result.id);
    }
  }

  spectate() {
    this.spectator = !this.spectator
    this.vote = ''
    this.pb.voteOnTable(this.voteId, this.tableId, '', this.spectator)
  }

  ngOnDestroy() {
    if (this.voteId != '') {
      this.pb.voteOnTable(this.voteId, this.tableId, '').then(result => this.voteId = result.id);
    }

    this.pb.unsubscribeVoting();
    this.pb.unsubscribeVotingReveal();
  }

  private refreshVotes() {
    this.pb.getCurrentVotes(this.tableId, this.votesRevealed).then(res => {
      this.currentVotes = res.map(x => {
        return {
          vote: x['vote'],
          spectator: x['spectator'],
          user: x.expand!['user']['username']
        } as Vote
      })
    })
  }

  public revealVotes() {
    if (!this.votesRevealed) {
      this.pb.revealVotes(this.tableId);
    } else {
      this.pb.resetVotes(this.tableId);
    }
  }
}

