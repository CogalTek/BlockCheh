pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'blockcheh'
        MON_FICHIER = credentials('blockchehapp')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Load Environment') {
            steps {
                // MON_FICHIER pointe vers le fichier temporaire créé par Jenkins
                // à partir du credential 'blockchehapp' (Secret file)
                sh 'cp $MON_FICHIER .env'
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build --no-cache'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                script {
                    // Attend que l'app soit prête (max 60s)
                    def maxRetries = 12
                    def retryInterval = 5
                    def healthy = false

                    for (int i = 0; i < maxRetries; i++) {
                        def status = sh(
                            script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:8085 || echo 000',
                            returnStdout: true
                        ).trim()

                        if (status == '200') {
                            healthy = true
                            echo "✅ App is healthy (HTTP 200)"
                            break
                        }

                        echo "⏳ Waiting for app... (attempt ${i + 1}/${maxRetries}, status: ${status})"
                        sleep(retryInterval)
                    }

                    if (!healthy) {
                        echo "📋 Container logs:"
                        sh 'docker compose logs app --tail=50'
                        error("❌ App failed health check after ${maxRetries * retryInterval}s")
                    }
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Pipeline failed!'
            sh 'docker compose logs --tail=100'
        }
        success {
            echo '✅ BlockCheh deployed successfully!'
        }
        cleanup {
            // Supprime le fichier .env du workspace
            sh 'rm -f .env'
        }
    }
}
