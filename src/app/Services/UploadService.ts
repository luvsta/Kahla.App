import { Injectable } from '@angular/core';
import { AES } from 'crypto-js';
import { FilesApiService } from './FilesApiService';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { UploadFile } from '../Models/UploadFile';
import { KahlaUser } from '../Models/KahlaUser';
import { ConversationApiService } from './ConversationApiService';
import * as loadImage from 'blueimp-load-image';
import { GroupConversation } from '../Models/GroupConversation';
import { Values } from '../values';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    public talkingDestroyed = false;

    constructor(
        private filesApiService: FilesApiService,
        private conversationApiService: ConversationApiService,
    ) {}

    public upload(file: File, conversationID: number, aesKey: string, fileType: number): void {
        if (!this.validateFileSize(file)) {
            Swal.fire('Error', 'File size should larger than or equal to one bit and less then or equal to 1000MB.', 'error');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        if (fileType === 0 && !this.validImageType(file, false)) {
            Swal.fire('Try again', 'Only support .png, .jpg, .jpeg, .svg, gif or .bmp file', 'error');
            return;
        }
        if (fileType === 3) {
            const audioSrc = URL.createObjectURL(file);
            const audioHTMLString = `<audio controls src="${audioSrc}"></audio>`;
            Swal.fire({
                title: 'Are you sure to send this message?',
                html: audioHTMLString,
                type: 'question',
                showCancelButton: true
            }).then(result => {
                if (result.value) {
                    this.filesApiService.UploadFile(formData, conversationID).subscribe(response => {
                        this.encryptThenSend(response, fileType, conversationID, aesKey, file);
                    }, () => {
                        Swal.close();
                        Swal.fire('Error', 'Upload failed', 'error');
                    });
                }
                URL.revokeObjectURL(audioSrc);
            });
        } else {
            const alert = this.fireUploadingAlert(`Uploading your ${fileType === 0 ? 'image' : (fileType === 1 ? 'video' : 'file')}...`);
            const mission = this.filesApiService.UploadFile(formData, conversationID).subscribe(response => {
                if (Number(response)) {
                    this.updateAlertProgress(Number(response));
                } else if (response) {
                    Swal.close();
                    this.encryptThenSend(response, fileType, conversationID, aesKey, file);
                }
            }, () => {
                Swal.close();
                Swal.fire('Error', 'Upload failed', 'error');
            });
            alert.then(result => {
                if (result.dismiss) {
                    mission.unsubscribe();
                }
            });
        }
    }

    private fireUploadingAlert(title: string): Promise<SweetAlertResult> {
        const result = Swal.fire({
            title: title,
            html: '<div id="progressText">0%</div><progress id="uploadProgress" max="100"></progress>',
            showCancelButton: true,
            showConfirmButton: false,
            allowOutsideClick: false
        });
        Swal.showLoading();
        Swal.enableButtons();
        return result;
    }

    private updateAlertProgress(progress: number): void {
        (<HTMLProgressElement>Swal.getContent().querySelector('#uploadProgress')).value = progress;
        (<HTMLDivElement>Swal.getContent().querySelector('#progressText')).innerText = `${progress}%`;
    }

    private encryptThenSend(response: number | UploadFile, fileType: number, conversationID: number, aesKey: string, file: File): void {
        if (response && !Number(response)) {
            if ((<UploadFile>response).code === 0) {
                let encedMessages;
                switch (fileType) {
                    case 0:
                        loadImage(
                            file,
                            function (img, data) {
                                let orientation = 0, width = img.width, height = img.height;
                                if (data.exif) {
                                    orientation = data.exif.get('Orientation');
                                    if (orientation >= 5 && orientation <= 8) {
                                        [width, height] = [height, width];
                                    }
                                }
                                encedMessages = AES.encrypt(`[img]${(<UploadFile>response).filePath}|${width}|${
                                    height}|${orientation}`, aesKey).toString();
                                this.sendMessage(encedMessages, conversationID);
                            }.bind(this),
                            {meta: true}
                        );
                        break;
                    case 1:
                        encedMessages = AES.encrypt(`[video]${(<UploadFile>response).filePath}`, aesKey).toString();
                        this.sendMessage(encedMessages, conversationID);
                        break;
                    case 2:
                        encedMessages = AES.encrypt(this.formatFileMessage(<UploadFile>response, file.name), aesKey).toString();
                        this.sendMessage(encedMessages, conversationID);
                        break;
                    case 3:
                        encedMessages = AES.encrypt(`[audio]${(<UploadFile>response).filePath}`, aesKey).toString();
                        this.sendMessage(encedMessages, conversationID);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    private sendMessage(message: string, conversationID: number): void {
        this.conversationApiService.SendMessage(conversationID, message, [])
            .subscribe(() => {
                this.scrollBottom(true);
            }, () => {
                const unsentMessages = new Map(JSON.parse(localStorage.getItem('unsentMessages')));
                if (unsentMessages.get(conversationID) && (<Array<string>>unsentMessages.get(conversationID)).length > 0) {
                    const tempArray = <Array<string>>unsentMessages.get(conversationID);
                    tempArray.push(message);
                    unsentMessages.set(conversationID, tempArray);
                } else {
                    unsentMessages.set(conversationID, [message]);
                }
                localStorage.setItem('unsentMessages', JSON.stringify(Array.from(unsentMessages)));
            });
    }

    private validateFileSize(file: File): boolean {
        if (file === null || file === undefined) {
            return false;
        }
        return file.size >= 0.125 && file.size <= 1000000000;
    }

    public scrollBottom(smooth: boolean): void {
        if (!this.talkingDestroyed) {
            const h = document.documentElement.scrollHeight;
            if (document.querySelector('.message-list').scrollHeight < window.innerHeight - 50) {
                window.scroll(0, 0);
            } else if (smooth) {
                window.scroll({top: h, behavior: 'smooth'});
            } else {
                window.scroll(0, h);
            }
        }
    }

    public uploadAvatar(user: KahlaUser, file: File): void {
        if (this.validImageType(file, true)) {
            const formData = new FormData();
            formData.append('image', file);
            const alert = this.fireUploadingAlert('Uploading your avatar...');
            const mission = this.filesApiService.UploadIcon(formData).subscribe(response => {
                if (Number(response)) {
                    this.updateAlertProgress(Number(response));
                } else if (response != null && (<UploadFile>response).code === 0) {
                    Swal.close();
                    user.iconFilePath = (<UploadFile>response).filePath;
                    user.avatarURL = Values.fileAddress + user.iconFilePath;
                }
            });
            alert.then(result => {
                if (result.dismiss) {
                    mission.unsubscribe();
                }
            });
        } else {
            Swal.fire('Try again', 'Only support .png, .jpg, .jpeg or .bmp file', 'error');
        }
    }

    public uploadGroupAvater(group: GroupConversation, file: File): void {
        if (this.validImageType(file, true)) {
            const formData = new FormData();
            formData.append('image', file);
            const alert = this.fireUploadingAlert('Uploading group avatar...');
            const mission = this.filesApiService.UploadIcon(formData).subscribe(response => {
                if (Number(response)) {
                    this.updateAlertProgress(Number(response));
                } else if (response != null && (<UploadFile>response).code === 0) {
                    Swal.close();
                    group.groupImagePath = (<UploadFile>response).filePath;
                    group.avatarURL = Values.fileAddress + group.groupImagePath;
                }
            });
            alert.then(result => {
                if (result.dismiss) {
                    mission.unsubscribe();
                }
            });
        } else {
            Swal.fire('Try again', 'Only support .png, .jpg, .jpeg or .bmp file', 'error');
        }
    }

    public validImageType(file: File, avatar: boolean): boolean {
        const validAvatarTypes = ['png', 'jpg', 'bmp', 'jpeg'];
        const validChatTypes = ['png', 'jpg', 'bmp', 'jpeg', 'gif', 'svg'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (avatar) {
            return validAvatarTypes.includes(fileExtension);
        } else {
            return validChatTypes.includes(fileExtension);
        }
    }

    public getFileURL(event: MouseEvent, message: string): void {
        event.preventDefault();
        const link = document.createElement('a');
        link.href = Values.fileDownloadAddress + encodeURIComponent(message.substring(6).split('|')[0]).replace(/%2F/g, '/');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    public getAudio(target: HTMLElement, message: string): void {
        target.style.display = 'none';
        const audioElement = document.createElement('audio');
        audioElement.style.maxWidth = '100%';
        audioElement.src = Values.fileAddress + encodeURIComponent(message.substring(7).split('|')[0]).replace(/%2F/g, '/');
        audioElement.controls = true;
        target.parentElement.appendChild(audioElement);
        audioElement.play();
    }

    private formatFileMessage(response: UploadFile, fileName: string): string {
        let message = `[file]${response.filePath}|${fileName}|`;
        const units = ['kB', 'MB', 'GB'];
        const thresh = 1000;
        if (response.fileSize < thresh) {
            message += response.fileSize + ' B';
        } else {
            let index = -1;
            do {
                response.fileSize /= thresh;
                index++;
            } while (response.fileSize >= thresh && index < units.length - 1);
            message += response.fileSize.toFixed(1) + ' ' + units[index];
        }
        return message;
    }
}
