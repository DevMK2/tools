module.exports = function (grunt) {
  grunt.initConfig({
    watch: {
      options: {
        livereload: true // 라이브리로드 설정
      },
      express:{
        files: [ 'static/**/*', 'views/*' ],
        options:{
          livereload:1338,
          spawn:false
        }
      },
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
}
