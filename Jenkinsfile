pipeline {
  agent any
  stages {
    stage('install') {
      steps {
        sh 'npm install'
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
}