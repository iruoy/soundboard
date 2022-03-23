pipeline {
  agent {
    node {
      label 'soundboard'
    }

  }
  stages {
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