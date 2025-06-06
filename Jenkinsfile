pipeline {
   agent { any { image 'mcr.microsoft.com/playwright:v1.52.0-noble' } }
   stages {
      stage('install') {
          steps {
              sh '''
                npm i
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
