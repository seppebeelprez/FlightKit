<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

/**
 * Class ArteveldeDatabaseUser.
 *
 * Use:
 * $ php artisan artevelde:database:user
 *
 * @author Olivier Parent <olivier.parent@arteveldehs.be>
 * @copyright Copyright © 2015-2016, Artevelde University College Ghent
 */
class ArteveldeDatabaseUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'artevelde:database:user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates a database user based on the configuration';

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
        $dbAdminUsername = getenv('DB_ADMIN_USERNAME');
        $dbAdminPassword = getenv('DB_ADMIN_PASSWORD');

        // Add database user with all privileges on (nonexistent) database
        $sql = "GRANT ALL PRIVILEGES ON ${dbName}.* TO '${dbUsername}' IDENTIFIED BY '${dbPassword}'";
        $command = sprintf('MYSQL_PWD=%s mysql --user=%s --execute="%s"', $dbAdminPassword, $dbAdminUsername, $sql);
        exec($command);

        $this->comment("Database user `${dbUsername}` created!");
    }
}
