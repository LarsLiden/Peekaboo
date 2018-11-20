/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
export const HEAD_IMAGE = "https://peekaboo.blob.core.windows.net/resources/HaveWeHead.png"
export const SAD_IMAGE = "https://peekaboo.blob.core.windows.net/resources/SAD_FACE.png"

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function setStatePromise(that: any, newState: any) {
    return new Promise((resolve) => {
        that.setState(newState, () => {
            resolve();
        });
    });
}

export function generateGUID(): string {
    let d = new Date().getTime()
    let guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
      let r = ((d + Math.random() * 16) % 16) | 0
      d = Math.floor(d / 16)
      return (char === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return guid
}