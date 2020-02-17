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
}