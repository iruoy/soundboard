pipeline {
  agent any
  stages {
    stage('install') {
      steps {
        sh 'npm install'
      }
    }
    
    stage('browserslist') {
      steps {
        sh 'npx browserslist@latest --update-db'
      }
    }

    stage('lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('build') {
      steps {
        sh 'npm run build'
      }
    }

  }
  environment {
    SENTRY_AUTH_TOKEN = '82e884879d074c0093918f34b4d7bb2be158df619562414a916b7a7940686647'
    NEXT_PUBLIC_SENTRY_DSN = 'https://b2ccd9d30f9c481babfafa79112dde1d@o771036.ingest.sentry.io/5909114'
    SENTRY_PROJECT = 'soundboard'
    SENTRY_ORG = 'iruoy'
  }
}
