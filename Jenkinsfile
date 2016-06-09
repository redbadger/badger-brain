#!groovy

node {
  def nodeHome = tool 'nodejs'
  env.PATH="${env.PATH}:${nodeHome}/bin"

  stage 'Install'
    sh 'node -v'
    sh 'npm prune'
    sh 'npm install'

  stage 'Test'
    sh 'npm test'

  stage 'Cleanup'
    sh 'npm prune'
    sh 'rm node_modules -rf'
}
