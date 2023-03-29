import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'ChatGPT Enhanced Conversation History',
  description: 'Search & Fully Load ChatGPT Conversation History',
  version: '0.0.1',
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    19: 'img/logo-19.png',
    38: 'img/logo-38.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_icon: 'img/logo-48.png',
  },

  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/content/index.js'],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'img/logo-16.png',
        'img/logo-19.png',
        'img/logo-38.png',
        'img/logo-48.png',
        'img/logo-128.png',
      ],
      matches: [],
    },
  ],
})
