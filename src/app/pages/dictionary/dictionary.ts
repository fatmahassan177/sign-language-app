
import { Component, OnInit } from '@angular/core';
import { DictionaryService } from '../../core/services/dictionary-service';
import { IDictionary } from '../../core/Model/dictionary.model';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dictionary.html',
  styleUrl: './dictionary.css',
})
export class Dictionary implements OnInit {

 private dictSubject = new BehaviorSubject<any>(null);
  dictionary$ = this.dictSubject.asObservable();

  showVideoModal = false;
  currentVideoUrl: string | null = null;

  constructor(private _dictS: DictionaryService) {}

  ngOnInit(): void {
    this.getWords();
  }

  getWords() {
    this._dictS.getWords().subscribe({
      next: (res: any) => {
        console.log('Dictionary data:', res.data);
        this.dictSubject.next(res);
      },
      error: (err) => console.log(err)
    });
  }

  openVideoModal(videoUrl: string) {
    this.currentVideoUrl = 'https://itkalemsign.runasp.net' + videoUrl;
    this.showVideoModal = true;
  }

  closeVideoModal() {
    this.showVideoModal = false;
    this.currentVideoUrl = null;
  }
}