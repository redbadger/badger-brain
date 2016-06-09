#!groovy

node {
  def nodeHome = tool 'nodejs'
  env.PATH="${env.PATH}:${nodeHome}/bin"

  stage 'Install'
    sh 'node -v'
    sh 'npm install'

  stage 'Test'
    sh 'npm test'
}
