<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

/**
 * Class ArteveldeDatabaseInit.
 *
 * Use:
 * $ php artisan artevelde:database:init
 *
 * @author Olivier Parent <olivier.parent@arteveldehs.be>
 * @copyright Copyright © 2015-2016, Artevelde University College Ghent
 */
class ArteveldeDatabaseInit extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'artevelde:database:init {--seed : Run migrations and seed}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates database user and database, and executes migrations';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // Get variables from `.env`
        $dbName = getenv('DB_DATABASE');
        $dbUsername = getenv('DB_USERNAME');
        $dbPassword = getenv('DB_PASSWORD');

        // Drop database
        $this->callSilent('artevelde:database:drop');

        // Create database
        $sql = "CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8 COLLATE utf8_general_ci";
        $command = sprintf('MYSQL_PWD=%s mysql --user=%s --execute="%s"', $dbPassword, $dbUsername, $sql);
        exec($command);

        // Run migrations
        if ($this->option('seed')) {
            $this->call('migrate', [
                '--seed' => true,
            ]);
        }

        $this->comment("Database `${dbName}` initialized!");
    }
}
