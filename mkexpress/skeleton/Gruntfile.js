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
    },
    connect: {
      server: {
        options: {
          livereload: true, // 라이브리로드 설정
          base: 'static',
          port: 3000,
          keepalive:true
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.registerTask('dev', ['express', 'watch'])
  grunt.registerTask('server', ['express:dev', 'watch'])
}
