pipeline {
   agent { any { image 'mcr.microsoft.com/playwright/python:v1.51.0-noble' } }
   stages {
      stage('install') {
          steps {
              sh '''
                npm i -D @playwright/test
                npx playwright install
                '''
          }
      }
      stage('test') {
         steps {
                sh '''
                npx playwright test --list
                npx playwright test
                '''
         }
      }
   }
}