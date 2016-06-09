#!groovy

node {
  def nodeHome = tool 'nodejs'
  env.PATH='${env.PATH}:${nodeHome}/bin'

  stage 'Install'
    node -v
    npm prune
    npm install

  stage 'Test'
    npm test

  stage 'Cleanup'
    npm prune
    rm node_modules -rf
}
