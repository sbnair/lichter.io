import path from 'path'
import glob from 'glob-all'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import PurgecssPlugin from 'purgecss-webpack-plugin/lib/purgecss-webpack-plugin.es'
import { colors } from './tailwind.js'

export default {
  /*
  ** Headers of the page
  */
  head: {
    meta: [
      {
        'http-equiv': 'x-ua-compatible', content: 'ie=edge'
      }
    ],
    __dangerouslyDisableSanitizers: ['script'],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(
          {
            '@context': 'http://schema.org',
            '@type': 'Person',
            'address': {
              '@type': 'PostalAddress',
              'addressCountry': 'DE',
              'addressLocality': 'Leipzig',
              'addressRegion': 'Sachsen',
              'postalCode': '04289',
              'streetAddress': 'Corotweg 15'
            },
            'name': 'Alexander Lichter',
            'image': 'https://lichter.io/img/me@2x.jpg',
            'email': 'mailto:hello@lichter.io',
            'telephone': '+49 17670625208',
            'jobTitle': 'Founder of Developmint',
            'url': 'https://lichter.io',
            'sameAs': [
              'https://twitter.com/TheAlexLichter',
              'https://github.com/manniL',
              'https://linkedin.com/in/alexanderlichter'
            ]
          })
      }
    ]
  },
  meta: {
    name: 'Lichter.io - Alexander Lichter',
    author: 'Alexander Lichter',
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    mobileAppIOs: true,
    ogHost: 'https://lichter.io',
    twitterCard: 'summary',
    twitterCreator: '@TheAlexLichter'
  },
  /*
  ** CSS Load
   */
  css: [
    // SCSS file in the project
    '@/assets/styles/app.scss'
  ],
  /*
  ** Nuxt plugins
   */
  plugins: [
    { src: '~/plugins/vue-smooth-scroll', ssr: false },
    { src: '~/plugins/vue-scroll-reveal', ssr: false }
  ],
  /*
  ** Modules
   */
  modules: [
    // Simple usage
    ['@nuxtjs/google-analytics', {
      id: 'UA-62902757-11'
    }],
    '@nuxtjs/pwa'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: colors.red },
  loadingIndicator: {
    name: 'rectangle-bounce',
    color: 'white',
    background: colors.red
  },
  /*
  ** Manifest
   */
  manifest: {
    name: 'Lichter.io',
    lang: 'en',
    short_name: 'Lichter.io',
    start_url: '/',
    display: 'standalone',
    background_color: colors['grey-lighter'],
    theme_color: colors.red
  },
  /*
   * Render (preload & prefetch)
   */
  render: {
    bundleRenderer: {
      shouldPrefetch: (file, type) => {
        if (type === 'script') {
          const ignoredRoutes = ['legal']
          if (ignoredRoutes.some(r => file.includes(r))) {
            return false
          }
        }
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: {
      allChunks: true
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    postcss: [
      tailwindcss('./tailwind.js'),
      autoprefixer
    ],
    /*
    ** Run ESLint on save
    ** Add PurgeCSS
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        if (ctx.isDev) {
          config.module.rules.push({
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules)/
          })
        } else {
          config.plugins.push(new PurgecssPlugin({
            paths: glob.sync([
              path.join(__dirname, 'components/**/*.vue'),
              path.join(__dirname, 'layouts/**/*.vue'),
              path.join(__dirname, 'pages/**/*.vue'),
              path.join(__dirname, 'plugins/**/*.vue')
            ]),
            styleExtensions: ['.css'],
            whitelist: ['body', 'html', 'nuxt-progress'],
            extractors: [
              {
                extractor: class {
                  static extract (content) {
                    return content.match(/[A-z0-9-:\\/]+/g)
                  }
                },
                extensions: ['vue']
              }
            ]
          }))
        }
      }
    }
  }
}
