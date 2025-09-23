pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:${env.PATH}"
        TOMCAT_HOME = "/Users/vadlanibhavya/Downloads/apache-tomcat-10.1.43"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir('BOOKSHOP-REACT') {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                FRONTEND_DIR="$TOMCAT_HOME/webapps/bookshop"
                rm -rf "$FRONTEND_DIR"
                mkdir -p "$FRONTEND_DIR"
                cp -R BOOKSHOP-REACT/dist/* "$FRONTEND_DIR"
                '''
            }
        }

        stage('Build Backend WAR') {
            steps {
                dir('BOOKSHOP-SPRINGBOOT') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Deploy Backend WAR to Tomcat') {
            steps {
                sh '''
                WAR_FILE="BOOKSHOP-SPRINGBOOT/target/bookshop-springboot-0.0.1-SNAPSHOT.war"
                cp "$WAR_FILE" "$TOMCAT_HOME/webapps/bookshop-springboot.war"
                '''
            }
        }

        stage('Restart Tomcat') {
            steps {
                sh '''
                $TOMCAT_HOME/bin/shutdown.sh || true
                sleep 3
                $TOMCAT_HOME/bin/startup.sh
                '''
            }
        }
    }  // 👈 closes stages

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo ' Pipeline Failed.'
        }
    }
}
