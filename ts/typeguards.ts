const guards = {
  isHTMLElem: (arg: any): arg is HTMLElement => {
    return arg !== null && arg !== undefined && arg.tagName.length > 0
  },

  isMedia: (arg: any): arg is HTMLMediaElement => {
    return arg !== null && arg !== undefined && arg.tagName === 'MEDIA'
  },

  isAudio: (arg: any): arg is HTMLAudioElement => {
    return arg !== null && arg !== undefined && arg.tagName === 'AUDIO'
  },

  isVideo: (arg: any): arg is HTMLVideoElement => {
    return arg !== null && arg !== undefined && arg.tagName === 'VIDEO'
  },

  isInput: (arg: any): arg is HTMLInputElement => {
    return arg !== null && arg !== undefined && arg.tagName === 'INPUT'
  },

  isIFrame: (arg: any): arg is HTMLIFrameElement => {
    return arg !== null && arg !== undefined && arg.tagName === 'IFRAME'
  },

  isHTMLDoc: (arg: any): arg is HTMLDocument => {
    const typeStr = Object.prototype.toString.call(arg)
    const type = /\[object ([^\]]+)]/.exec(typeStr)
    if (type === null) return false
    return arg !== null && arg !== undefined && type[1] === 'HTMLDocument'
  },

  canInnertext: (arg: any): arg is HTMLElement => {
    return arg !== null && arg !== undefined && arg.innerText !== undefined
  }
}

export default guards
