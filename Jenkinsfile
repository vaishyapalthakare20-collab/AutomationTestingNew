pipeline {
    agent any

    tools {
        // Configure a NodeJS installation named 'Node20' in Jenkins > Global Tool Configuration
        nodejs 'Node20'
    }

    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Browser project to run'
        )
        choice(
            name: 'SUITE',
            choices: ['all', 'smoke', 'regression'],
            description: 'Test suite to execute'
        )
    }

    options {
        timestamps()
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        CI = 'true'
        HEADLESS = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def projectFlag = params.BROWSER == 'all' ? '' : "--project=${params.BROWSER}"
                    def grepFlag = ''
                    if (params.SUITE == 'smoke') {
                        grepFlag = '--grep @smoke'
                    } else if (params.SUITE == 'regression') {
                        grepFlag = '--grep @regression'
                    }
                    sh "npx playwright test ${projectFlag} ${grepFlag}"
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'npm run allure:generate'
            }
        }
    }

    post {
        always {
            // Publish JUnit results
            junit allowEmptyResults: true, testResults: 'reports/junit-report/results.xml'

            // Publish Allure report (requires the Allure Jenkins plugin)
            allure([
                includeProperties: false,
                jdk: '',
                results: [[path: 'reports/allure-results']]
            ])

            // Archive HTML report + artifacts
            archiveArtifacts artifacts: 'reports/**, test-results/**', allowEmptyArchive: true

            // Publish Playwright HTML report (requires HTML Publisher plugin)
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports/html-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
        }
        success {
            echo 'Tests passed successfully.'
        }
        failure {
            echo 'Some tests failed. Check the reports for details.'
        }
        cleanup {
            cleanWs()
        }
    }
}
