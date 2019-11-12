import { Injectable } from '@angular/core';
import { TagsInfo } from '../../../../../common/communication/tags';
import { TagCommunicationService } from '../serverCommunication/tag-communication.service';

@Injectable({
  providedIn: 'root',
})
export class TagHandlerService {

  allTags: TagsInfo[];
  tagsName: string[] = [];
  constructor(private tagCommunicationService: TagCommunicationService) {
    this.allTags = [];
    this.tagsName = [];
  }

  async loadTags(): Promise<boolean> {
    this.allTags = [];
    this.tagsName = [];
    return new Promise((resolve, reject) => {
      this.tagCommunicationService.getAllTags().subscribe((tags: TagsInfo[]) => {
        if (tags && tags.length !== 0) {
          this.allTags = (tags && tags.length !== 0) ? tags : [];
          this.allTags.forEach((tag) => {
            this.tagsName.push(tag.tagName);
          });
          resolve(true);
        } else {
          resolve(false);
        }
      }, () => {
        reject('Erreur de communication avec le server');
      });
    });
  }

  filterTagsName(filter: string): string[] {
    if (filter.length === 0) {
      return this.tagsName;
    }
    return this.tagsName.filter((tagName) => tagName.toLowerCase().indexOf(filter.toLowerCase()) > -1);
  }

  getTag(tagName: string): TagsInfo {
    const tagTemp = this.allTags.find((tag) => {
      return tag.tagName === tagName;
    });
    if (tagTemp) {
      return tagTemp;
    }
    return {
      id: -1,
      tagName,
    };
  }

  convertTagSelectedToString(tags: TagsInfo[], tagsToMark: TagsInfo[]): string {
    let msg: string;
    if (tags.length !== 0) {
      msg = 'Étiquettes: ';
      tags.forEach((tag) => {
        if (this.isTagPresent(tag.tagName, tagsToMark)) {
          msg += '<mark><b>' + tag.tagName + '</b></mark>, ';
        } else {
          msg += tag.tagName + ', ';
        }
      });
      // enlevons la dernière virgule
      msg = msg.slice(0, msg.length - 2);
    } else {
      msg = 'Aucune étiquette';
    }

    return msg;
  }

  isTagPresent(tagName: string, tags: TagsInfo[]): boolean {
    return (tags.find((tag) => {
      return tag.tagName === tagName;
    })) ? true : false;
  }

  areAllTagPresent(tagsToCheck: TagsInfo[], tags: TagsInfo[]): boolean {
    return tagsToCheck.every((tagFilter) => {
      return tags.some((tag) => {
        return tagFilter.id === tag.id;
      });
    });

  }
}
