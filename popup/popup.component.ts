import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<boolean>();
  @Output() setPhotos = new EventEmitter<Array<any>>();

  formDocImporte!: FormGroup;
  fichiersAEnvoyer: Array<any> = [];
  isFileselect = false;
  stateBtnEnvoyer = 0;
  dragAreaClass: string = "";
  numExpertise = 0;
  chargement = false;

  optionsComp = {
    maxSizeMB: 0.9,
    // maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.formDocImporte = fb.group({
      fichier: ['',]
    })
  }

  ngOnInit(): void {
    this.dragAreaClass = "dragarea";
  }

  close(rechargement: boolean) {
    this.closePopup.emit(rechargement);
  }


  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.chargerLesFichiers(files);
  }
  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      if (!this.isFileselect) {
        let files: FileList = event.dataTransfer.files;
        this.chargerLesFichiers(files);
      }
    }
  }
  

  async chargerLesFichiers(files: FileList) {
    /// console.log("FILES", files);
    this.isFileselect = true;
    this.chargement = true;
    this.fichiersAEnvoyer = [];
    for (let index = 0; index < files.length; index++) {
      if (files[index] && files[index].type.startsWith('image/')) {

        const compressedFile = await imageCompression(files[index], this.optionsComp);

        console.log('avant', files[index]);
        console.log('apres', compressedFile);

        let objectURL = URL.createObjectURL(files[index]);
        let fichierBlob = await fetch(objectURL).then(r => r.blob());
        let urlFile: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);

        let objectURL2 = URL.createObjectURL(compressedFile);
        let fichierBlob2 = await fetch(objectURL2).then(r => r.blob());
        let urlFile2: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL2);
        
        let nomDoc = files[index].name;
        let extension = nomDoc.split(".").pop();
        this.fichiersAEnvoyer.push({src: urlFile, urlFile, fichierBlob, nomDoc, extension, time: "Avant" });
        this.fichiersAEnvoyer.push({src: urlFile2, urlFile : urlFile2, fichierBlob : fichierBlob2, nomDoc, extension, time: "Apres" });
      }
    }
    if (this.fichiersAEnvoyer.length > 0) {
      this.stateBtnEnvoyer = 1;
    }
    this.chargement = false;
    console.log("FILES", this.fichiersAEnvoyer);
  }


  async envoyerLesFichiers() {
    console.log("this.fichiersAEnvoyer : ", this.fichiersAEnvoyer);
    this.setPhotos.emit(this.fichiersAEnvoyer);
    this.closePopup.emit();
  };

  deleteFile(index: any) {
    this.fichiersAEnvoyer = [...this.fichiersAEnvoyer.slice(0, index), ...this.fichiersAEnvoyer.slice(index + 1, this.fichiersAEnvoyer.length)]
    if (this.fichiersAEnvoyer.length == 0) {
      this.isFileselect = false;
      this.stateBtnEnvoyer = 0;
      this.formDocImporte.get('fichier')?.setValue('');
    }
  }

}
