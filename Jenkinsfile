pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'damgwenn-app'
        REGISTRY_URL = 'your-registry-url' // Update this
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}", "-f Dockerfile.prod .")
                }
            }
        }

        stage('Test') {
            steps {
                // Add test steps here
                echo 'Running tests...'
            }
        }

        /* 
        // Uncomment and configure for deployment
        stage('Deploy') {
            steps {
                sh "docker compose -f docker-compose.prod.yaml up -d"
            }
        }
        */
    }
}
