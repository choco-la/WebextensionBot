export const isVisibility = (arg: string): arg is 'public' | 'unlisted' | 'private' | 'direct' => {
  return arg !== null && arg !== undefined && /^(?:public|unlisted|private|direct)$/.test(arg)
}
