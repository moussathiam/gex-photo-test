import { Component, OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  showAjouterPhoto: boolean = false;
  listeImages: Array<any> = [];
  loading = false;

  constructor(private _lightbox: Lightbox) { }

  ngOnInit(): void {
  }

  fShowAjouterPhoto() {
    this.showAjouterPhoto = true;
  }

  closePopup() {
    this.showAjouterPhoto = false;
  }

  open(index: number): void {
    this._lightbox.open(this.listeImages, index, { centerVertically: true, showImageNumberLabel: true });
    setTimeout(() => {
      document.getElementsByClassName("lb-controlContainer")[0].innerHTML += '<span id="btnDownloadImg"><i class="fas fa-download"></i></span>';
      document.querySelector('#btnDownloadImg i')!.addEventListener("click", (event) => {
        console.log('voir 12');
      });
    }, 10);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  setPhotos(photos: Array<any>) {
    this.listeImages = photos;
  }



  async download() {

    this.loading = true;

    let tabPara: Array<Paragraph> = [];

    for (let i = 0; i < this.listeImages.length; i+=2) {
      const bmp = await createImageBitmap(this.listeImages[i].fichierBlob);
      const { width, height } = bmp;
      bmp.close(); // free memory
      let para = new Paragraph({
        children: [
          new ImageRun({
            data: this.listeImages[i].fichierBlob,
            transformation: {
              width: 596,
              height: 596 / width * height,
            }
          }),
        ],
      })

      tabPara.push(para);
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [

            // new Paragraph({
            //   children: [
            //     new TextRun('Hello World'),
            //     new TextRun({
            //       text: 'Foo Bar',
            //       bold: true,
            //     }),
            //     new TextRun({
            //       text: '\tGithub is the best',
            //       bold: true,
            //     }),
            //   ],
            // }),

            ...tabPara,
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      console.log(blob);
      saveAs(blob, 'example.docx');
      console.log('Document created successfully');
      this.loading = false;
    });


  }

}
