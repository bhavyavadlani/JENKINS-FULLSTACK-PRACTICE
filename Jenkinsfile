pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:${env.PATH}"
        TOMCAT_HOME = "/Users/vadlanibhavya/Downloads/apache-tomcat-10.1.43"
    }

    stages {
        stage('Print Git Commit') {
            steps {
                sh 'git rev-parse HEAD'
            }
        }

        stage('Check Node, NPM & Maven') {
            steps {
                sh '''
                which node || echo "node not found"
                which npm || echo "npm not found"
                node -v || echo "node version unknown"
                npm -v || echo "npm version unknown"

                which mvn || echo "mvn not found"
                mvn -v || echo "mvn version unknown"
                '''
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

        stage('Deploy Frontend to Tomcat') {
            steps {
                sh '''
                REACT_DEPLOY_DIR="$TOMCAT_HOME/webapps/bookshop"

                rm -rf "$REACT_DEPLOY_DIR"
                mkdir -p "$REACT_DEPLOY_DIR"

                cp -R BOOKSHOP-REACT/dist/* "$REACT_DEPLOY_DIR"
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

        stage('Deploy Backend to Tomcat') {
            steps {
                sh '''
                WAR_FILE="BOOKSHOP-SPRINGBOOT/target/bookshop-springboot-0.0.1-SNAPSHOT.war"
                DEPLOY_DIR="$TOMCAT_HOME/webapps"

                # Remove old deployment
                rm -rf "$DEPLOY_DIR/bookshop-springboot" "$DEPLOY_DIR/bookshop-springboot.war"

                # Copy new WAR
                cp "$WAR_FILE" "$DEPLOY_DIR/bookshop-springboot.war"
                '''
            }
        }
    

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo ' Pipeline Failed.'
        }
    }
}
}
