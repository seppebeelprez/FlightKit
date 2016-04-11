<?php

namespace GdmGent\Artestead;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class MakeCommand extends Command
{
    /**
     * The base path of the Laravel installation.
     *
     * @var string
     */
    protected $basePath;

    /**
     * The name of the project folder.
     *
     * @var string
     */
    protected $projectName;

    /**
     * Sluggified Project Name.
     *
     * @var string
     */
    protected $defaultName;

    /**
     * Configure the command options.
     *
     * @return void
     */
    protected function configure()
    {
        $this->basePath = getcwd();
        $this->projectName = basename(getcwd());
        $this->defaultName = strtolower(trim(preg_replace('/[^A-Za-z0-9-.]+/', '-', $this->projectName)));

        $this
            ->setName('make')
            ->setDescription('Install Artestead into the current project')
            ->addOption('type', null, InputOption::VALUE_REQUIRED, 'Type of hosting: drupal, laravel, symfony, wordpress')
            ->addOption('name', null, InputOption::VALUE_OPTIONAL, 'The name of the virtual machine.', $this->defaultName)
            ->addOption('hostname', null, InputOption::VALUE_OPTIONAL, 'The hostname of the virtual machine.', $this->defaultName)
            ->addOption('ip', null, InputOption::VALUE_OPTIONAL, 'The IP address of the virtual machine.')
            ->addOption('example', null, InputOption::VALUE_NONE, 'Determines if a Artestead.yaml.example file is created.');
    }

    /**
     * Execute the command.
     *
     * @param  \Symfony\Component\Console\Input\InputInterface  $input
     * @param  \Symfony\Component\Console\Output\OutputInterface  $output
     * @return void
     */
    public function execute(InputInterface $input, OutputInterface $output)
    {
        if (! file_exists($this->basePath.'/Vagrantfile')) {
            copy(__DIR__.'/stubs/LocalizedVagrantfile', $this->basePath.'/Vagrantfile');
        }

        if (! file_exists($this->basePath.'/Artestead.yaml') && ! file_exists($this->basePath.'/Artestead.yaml.example')) {
            copy(__DIR__.'/stubs/Artestead.yaml', $this->basePath.'/Artestead.yaml');

            if ($input->getOption('name')) {
                $this->updateName($input->getOption('name'));
            }

            if ($input->getOption('hostname')) {
                $this->updateHostName($input->getOption('hostname'));
            }

            if ($input->getOption('ip')) {
                $this->updateIpAddress($input->getOption('ip'));
            }
        } elseif (! file_exists($this->basePath.'/Artestead.yaml')) {
            copy($this->basePath.'/Artestead.yaml.example', $this->basePath.'/Artestead.yaml');
        }
        
        if (! file_exists($this->basePath.'/.gitignore')) {
            copy(__DIR__.'/stubs/gitignore', $this->basePath.'/.gitignore');
        }

        if (! file_exists($this->basePath.'/after.sh')) {
            copy(__DIR__.'/stubs/after.sh', $this->basePath.'/after.sh');
        }

        if (! file_exists($this->basePath.'/aliases.sh')) {
            copy(__DIR__.'/stubs/aliases.sh', $this->basePath.'/aliases.sh');
        }

        if ($input->getOption('example')) {
            if (! file_exists($this->basePath.'/Artestead.yaml.example')) {
                copy($this->basePath.'/Artestead.yaml', $this->basePath.'/Artestead.yaml.example');
            }
        }

        $this->configurePaths($input->getOption('type'));
        $this->configureAliases($input->getOption('type'));

        $output->writeln('Artestead Installed!');

        $command = "composer require gdmgent/artestead";
        passthru($command);
    }

    /**
     * Update paths in Artestead.yaml.
     *
     * @return void
     */
    protected function configurePaths($type = null)
    {
        $file = '/Artestead.yaml';
        $fileContent = $this->getFile($file);

        // Folders
        $fileContent = str_replace(
            '- map: ~/Code', '- map: "'.str_replace('\\', '/', $this->basePath).'"', $fileContent
        );
        $fileContent = str_replace(
            'to: /home/vagrant/Code', 'to: "/home/vagrant/'.$this->defaultName.'"', $fileContent
        );
        if (isset($_SERVER['windir'])) {
            $fileContent = str_replace(
                'type: ~ # folder type', 'type: smb # folder type', $fileContent
            );
        } else {
            $fileContent = str_replace(
                'type: ~ # folder type', 'type: nfs # folder type', $fileContent
            );
        }

        // Sites
        switch ($type) {
            case 'drupal':
            case 'laravel':
            case 'symfony':
            case 'wordpress':
                break;
            default:
                $type = '~';
        }
        $fileContent = str_replace(
            'type: ~ # site type', 'type: '.$type.' # site type', $fileContent
        );
        $fileContent = str_replace(
            '- map: www.artestead.local', '- map: www.'.$this->defaultName, $fileContent
        );
        switch ($type) {
            case 'drupal':
                $typePath = 'www/drupal';
                break;
            case 'laravel':
                $typePath = 'www/public';
                break;
            case 'symfony':
                $typePath = 'www/web';
                break;
            case 'wordpress':
                $typePath = 'www/wordpress';
                break;
            default:
                $typePath = 'www';
        }
        $fileContent = str_replace(
            $this->defaultName.'"/Artestead/www', $this->defaultName.'/'.$typePath.'"', $fileContent
        );

        $fileContent = str_replace(
            '- artestead_local', '- '.preg_replace('/[^A-Za-z0-9-]+/', '_', $this->defaultName), $fileContent
        );

        file_put_contents($this->basePath.$file, $fileContent);
    }

    protected function configureAliases($type = null)
    {
        $file = '/aliases.sh';
        $fileContent = $this->getFile($file);
        $fileContent = str_replace(
            'alias p=\'cd ~/artestead.local\'', 'alias p=\'cd ~/'.$this->defaultName.'\'', $fileContent
        );
        if ('laravel' === $type) {
            $fileContent = str_replace(
                '# alias phpspec=\'vendor/bin/phpspec\'', 'alias phpspec=\'vendor/bin/phpspec\'', $fileContent
            );
            $fileContent = str_replace(
                '# alias phpunit=\'vendor/bin/phpunit\'', 'alias phpunit=\'vendor/bin/phpunit\'', $fileContent
            );
        }
        file_put_contents($this->basePath.$file, $fileContent);
    }

    /**
     * Update the "name" variable of the Artestead.yaml file.
     *
     * VirtualBox requires a unique name for each virtual machine.
     *
     * @param  string  $name
     * @return void
     */
    protected function updateName($name)
    {
        $file = '/Artestead.yaml';
        file_put_contents($this->basePath.$file, str_replace(
            'cpus: 1', 'cpus: 1'.PHP_EOL.'name: '.$name, $this->getFile($file)
        ));
    }

    /**
     * Set the virtual machine's hostname setting in the Artestead.yaml file.
     *
     * @param  string  $hostname
     * @return void
     */
    protected function updateHostName($hostname)
    {
        $file = '/Artestead.yaml';
        file_put_contents($this->basePath.'/Artestead.yaml', str_replace(
            'cpus: 1', 'cpus: 1'.PHP_EOL.'hostname: '.$hostname, $this->getFile($file)
        ));
    }

    /**
     * Set the virtual machine's IP address setting in the Artestead.yaml file.
     *
     * @param  string  $ip
     * @return void
     */
    protected function updateIpAddress($ip)
    {
        $file = '/Artestead.yaml';
        file_put_contents($this->basePath.'/Artestead.yaml', str_replace(
            'ip: "192.168.10.10"', 'ip: "'.$ip.'"', $this->getFile($file)
        ));
    }

    /**
     * Get the contents of a file.
     *
     * @param  string  $file
     * @return string
     */
    protected function getFile($file)
    {
        return file_get_contents($this->basePath.$file);
    }
}
