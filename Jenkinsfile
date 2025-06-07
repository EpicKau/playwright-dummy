pipeline {
   agent { docker { image 'mcr.microsoft.com/playwright:v1.52.0-noble' } }
   environment {
      SITEMAP_URL = 'https://parsmedia.info/cms/sitemap.xml'
   }
   stages {
      stage('install') {
         steps {
            sh 'npm ci'
         }
      }
      stage('Crawl Sitemap') {
         steps {
            echo "Crawling sitemap from ${SITEMAP_URL}"
            sh 'node crawlSitemap.js > urls.txt'
            sh 'cat urls.txt'
         }
      }
      stage('Run Tests for each URL') {
         steps {
            script {
               def urls = readLines(file: 'urls.txt')
               
               for (url in urls) {
                  stage("Test: ${url}") {
                        try {
                           withEnv(["URL=${url}"]) {
                              echo "Running tests for ${url}"
                              sh 'npx playwright test'
                           }
                        } catch (e) {
                           echo "Tests failed for ${url}"
                           // Markiert die Stage als FEHLGESCHLAGEN, aber lässt die Pipeline weiterlaufen.
                           currentBuild.result = 'UNSTABLE'
                        }
                  }
               }
            }
         }
      }
   }
   post {
      always {
         echo 'Test run finished.'
         archiveArtifacts artifacts: 'playwright-report/**', followSymlinks: false
      }
   }
}
