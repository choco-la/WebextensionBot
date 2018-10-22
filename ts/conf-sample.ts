const getPageUser = (): string => {
  const initStateNode = document.getElementById('initial-state')
  if (!initStateNode || !initStateNode.textContent) throw new Error('cannot get initial-state')
  const initState = JSON.parse(initStateNode.textContent)

  const me = initState.meta.me
  const meta = initState.meta
  const accounts = initState.accounts
  if (!me) throw new Error('cannot get me')
  else if (!meta) throw new Error('cannot get meta')
  else if (!accounts) throw new Error('cannot get accounts')

  if (!accounts[me].username) throw new Error('cannot get username')
  else if (!meta.domain) throw new Error('cannot get domain')
  return `${accounts[me].username}@${meta.domain}`
}

export const Auth = {
  bearerToken: 'ACCESS_TOKEN',
  hostName: 'friends.nico'
}
export const Configure = {
  admin: ['friends_nico@friends.nico'],
  owner: getPageUser()
}

export const whitelists = {
  notBot: []
}
