const config = {
  siteTitle: 'Dubs3c',
  siteTitleShort: 'dubs3c',
  siteTitleAlt: 'dubs3c',
  siteLogo: '/logos/tania.jpg',
  siteUrl: 'https://dubell.io',
  repo: 'https://github.com/mjdubell/mjdubell.github.io',
  pathPrefix: '',
  dateFromFormat: 'YYYY-MM-DD',
  dateFormat: 'MMMM Do, YYYY',
  siteDescription:
    'Hack, code, sleep, repeat',
  siteRss: '/rss.xml',
  googleAnalyticsID: '',
  disqusShortname: '',
  postDefaultCategoryID: 'Tech',
  userName: 'Michael',
  userEmail: 'michael@dubell.io',
  userTwitter: 'dubs3c',
  userLocation: '',
  userAvatar: 'https://api.adorable.io/avatars/150/test.png',
  userDescription:
    'Security Consultant | Offensive Security | OSCP | Bounty Hunter. Enjoys to build things and break things.',
  menuLinks: [
    {
      name: 'Me',
      link: '/me/',
    },
    {
      name: 'Articles',
      link: '/blog/',
    },
    {
      name: 'Contact',
      link: '/contact/',
    },
  ],
  themeColor: '#3F80FF', // Used for setting manifest and progress theme colors.
  backgroundColor: '#ffffff',
}

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === '/') {
  config.pathPrefix = ''
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, '')}`
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === '/') config.siteUrl = config.siteUrl.slice(0, -1)

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== '/') config.siteRss = `/${config.siteRss}`

module.exports = config
