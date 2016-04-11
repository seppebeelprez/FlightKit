require 'json'
require 'yaml'

VAGRANTFILE_API_VERSION ||= "2"
confDir = $confDir ||= File.expand_path("vendor/gdmgent/artestead", File.dirname(__FILE__))

homesteadYamlPath = "Artestead.yaml"
homesteadJsonPath = "Artestead.json"
afterScriptPath = "after.sh"
aliasesPath = "aliases.sh"

require File.expand_path(confDir + '/scripts/artestead.rb')

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    if File.exists? aliasesPath then
        config.vm.provision "file", source: aliasesPath, destination: "~/.bash_aliases"
    end

    if File.exists? homesteadYamlPath then
        Artestead.configure(config, YAML::load(File.read(homesteadYamlPath)))
    elsif File.exists? homesteadJsonPath then
        Artestead.configure(config, JSON.parse(File.read(homesteadJsonPath)))
    end

    if File.exists? afterScriptPath then
        config.vm.provision "shell", path: afterScriptPath
    end
end
