"use strict";

/*jshint node:true strict: true */

var request = require('request');
var parser = require(__dirname + '/../rule.js');

module.exports = function(grunt){
  var _ = grunt.utils._;

  /**
   *
   * @param {string} key
   * @return {object}
   */
  function computeConfiguration(key){
    var config = grunt.config.get(key || 'update') || {};
    var defaultConfig = require(__dirname + '/defaults.json');

    return _.extend(defaultConfig, config);
  }

  /**
   *
   * @param {string} provider
   * @param {object} config
   * @return {string}
   */
  function computeProvider(provider, config){
    var defaultProvider = config.default_provider;

    return provider && config.providers[provider] ? provider : defaultProvider;
  }

  /**
   * @param {string|undefined} provider
   */
  return function tldUpdate(provider){
    var done = this.async();
    var config = computeConfiguration(this.name);
    provider = computeProvider(provider, config);

    request.get(config.providers[provider], function (err, response, body) {
      if (err) {
        throw new Error(err);
      }

      var tlds = parser.parse(body);
      grunt.file.write(__dirname + '/../../src/rules.json', JSON.stringify(tlds));

      done();
    });
  };
};