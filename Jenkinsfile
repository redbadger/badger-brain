#!groovy

node('node') {
  currentBuild.result = "SUCCESS"

  try {
    stage 'Checkout'
      checkout scm

    stage 'Test'
      sh 'node -v'
      sh 'npm prune'
      sh 'npm install'
      sh 'npm test'
  }
  catch (err) {
    currentBuild.result = "FAILURE"
    throw err
  }
}
