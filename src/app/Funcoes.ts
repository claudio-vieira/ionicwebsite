import { ToastController } from '@ionic/angular';

export class Funcoes {

    static async mensagem(toastCtrl: ToastController, msg: string) {
       const toast = await toastCtrl.create({
         message: msg,
         duration: 2000,
         position: 'middle'
       });
       toast.present();
     }

     static replaceAccents(str: string): string
      {
          const ACCENTS = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          const NON_ACCENTS = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";

          const strAccents: string[] = str.split('');
          const strAccentsOut: string[] = new Array();

          const strAccentsLen: number = strAccents.length;

          for (let y = 0; y < strAccentsLen; y++) 
          {
              if (ACCENTS.indexOf(strAccents[y]) != -1)
              {
                  strAccentsOut[y] = NON_ACCENTS.substr(ACCENTS.indexOf(strAccents[y]), 1);
              } 
              else
              {
                      strAccentsOut[y] = strAccents[y];
              }
          }

          const newString: string = strAccentsOut.join('');
          return newString;
      }
}