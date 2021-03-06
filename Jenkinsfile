node {
    stage('Source checkout') {
        checkout([$class: 'GitSCM', branches: [[name: '*/master']], 
            doGenerateSubmoduleConfigurations: false, extensions: [], 
            submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'ussada.a', 
            url: 'https://github.com/ussada/ecommerce_back.git']]])
    }
    
    stage('Load test environment') {
        withCredentials([file(credentialsId: 'test_env', variable: 'TEST_ENV'),
            file(credentialsId: 'ssl_key', variable: 'SSL_KEY'),
            file(credentialsId: 'ssl_cert', variable: 'SSL_CERT')
        ]) {
            sh "cp \$TEST_ENV .env"
            sh "cp \$SSL_KEY cert.key"
            sh "cp \$SSL_CERT cert.pem"
        }
    }

    stage('Build image') {
        sh 'docker build -t ecommerce_back .'
    }
    
    stage('Create container') {
        withCredentials([string(credentialsId: 'DB_HOST', variable: 'DB_HOST'),
            string(credentialsId: 'DB_USER', variable: 'DB_USER'),
            string(credentialsId: 'DB_PASSWORD', variable: 'DB_PASSWORD'),
            string(credentialsId: 'DB_NAME', variable: 'DB_NAME'),
            string(credentialsId: 'DB_PORT', variable: 'DB_PORT'),
            string(credentialsId: 'API_ACCESS_KEY', variable: 'API_ACCESS_KEY')
        ]) {
            sh 'docker stop ecommerce_back || true'
            sh 'docker rm ecommerce_back || true'
            sh 'docker run --name ecommerce_back -e DB_HOST=$DB_HOST -e DB_USER=$DB_USER -e DB_PASSWORD=$DB_PASSWORD -e DB_NAME=$DB_NAME -e DB_PORT=$DB_PORT -e API_ACCESS_KEY=$API_ACCESS_KEY --network=ecommerce_db -p 3000:3000 -p 3005:3005 -d ecommerce_back'                
        }
    }
    
    stage('Clean out') {
        sh 'docker image prune -f'
    }
}