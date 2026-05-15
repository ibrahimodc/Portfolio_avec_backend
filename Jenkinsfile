pipeline{
    agent any
    
    stages{
        stage("Build"){
            steps{
                echo "========Building========"
            }
        }
        stage("Test"){
            steps{
                echo "========Testing========"
            }
        }
        stage("Deploy"){
            steps{
                echo "========Deploying========"
            }
        }
    }
    post{
        always{
            echo "========always========"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}


































// pipeline {
//     agent any

//     environment {
//         DOCKER_USER  = 'ibrahimodc'
//         IMG_BACKEND  = "${DOCKER_USER}/portfolio-backend"
//         IMG_FRONTEND = "${DOCKER_USER}/portfolio-frontend"
//         IMG_TAG      = "${BUILD_NUMBER}"
//     }

//     options {
//         timeout(time: 30, unit: 'MINUTES')
//         buildDiscarder(logRotator(numToKeepStr: '10'))
//         disableConcurrentBuilds()
//     }

//     stages {

//         stage('📥 Checkout') {
//             steps {
//                 checkout scm
//                 bat 'git log -1 --format="Commit: %h — %s"'
//             }
//         }

//         stage('📦 Installation') {
//             parallel {
//                 stage('Backend') {
//                     steps {
//                         dir('backend') {
//                             bat 'npm ci --only=production'
//                         }
//                     }
//                 }
//                 stage('Frontend') {
//                     steps {
//                         dir('frontend') {
//                             bat 'npm ci'
//                         }
//                     }
//                 }
//             }
//         }

//         stage('🔨 Build React') {
//             steps {
//                 dir('frontend') {
//                     bat 'npm run build'
//                 }
//             }
//         }

//         stage('🐳 Build Docker') {
//             parallel {
//                 stage('Backend Image') {
//                     steps {
//                         bat "docker build -t ${IMG_BACKEND}:${IMG_TAG} -t ${IMG_BACKEND}:latest ./backend"
//                     }
//                 }
//                 stage('Frontend Image') {
//                     steps {
//                         bat "docker build -t ${IMG_FRONTEND}:${IMG_TAG} -t ${IMG_FRONTEND}:latest ./frontend"
//                     }
//                 }
//             }
//         }

//         stage('📤 Push Docker Hub') {
//             steps {
//                 withCredentials([usernamePassword(
//                     credentialsId: 'dockerhub-credentials',
//                     usernameVariable: 'DUSER',
//                     passwordVariable: 'DPASS'
//                 )]) {
//                     bat 'echo %DPASS%| docker login -u %DUSER% --password-stdin'
//                     bat "docker push ${IMG_BACKEND}:${IMG_TAG}"
//                     bat "docker push ${IMG_BACKEND}:latest"
//                     bat "docker push ${IMG_FRONTEND}:${IMG_TAG}"
//                     bat "docker push ${IMG_FRONTEND}:latest"
//                     bat 'docker logout'
//                 }
//             }
//         }

//         stage('🚀 Déploiement') {
//             steps {
//                 bat 'docker-compose down --remove-orphans'
//                 bat 'docker-compose pull'
//                 bat 'docker-compose up -d'
//                 bat 'docker-compose ps'
//             }
//         }
//     }

//     // ✅ CORRECTION : post dans un node pour éviter l'erreur FilePath
//     post {
//         success {
//             node('') {
//                 echo "✅ Build #${BUILD_NUMBER} réussi !"
//             }
//         }
//         failure {
//             node('') {
//                 echo "❌ Build #${BUILD_NUMBER} échoué. Vérifie les logs."
//             }
//         }
//         always {
//             node('') {
//                 bat 'docker image prune -f'
//             }
//         }
//     }
// }