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

        stage('Build Backend') {
            steps {
                dir('BOOKSHOP-SPRINGBOOT') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Deploy Backend (Spring Boot)') {
            steps {
                sh '''
                JAR_FILE="BOOKSHOP-SPRINGBOOT/target/bookshop-springboot-0.0.1-SNAPSHOT.jar"

                # Kill old backend if running
                pkill -f "bookshop-springboot-0.0.1-SNAPSHOT.jar" || true

                # Start backend on port 9090
                nohup java -jar "$JAR_FILE" --server.port=9090 > "$WORKSPACE/backend.log" 2>&1 &
                '''
            }
        }

    }

    post {
        success {
            echo ' Deployment Successful!'
        }
        failure {
            echo ' Pipeline Failed.'
        }
    }
}
